import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from "@awesome-cordova-plugins/sqlite/ngx";
import {Note, NotesDisplayOption, NotesSortingMethod} from "../../model/note.model";
import {NotesService} from "./notes.service";
import {BehaviorSubject, firstValueFrom, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {SQLitePorter} from "@awesome-cordova-plugins/sqlite-porter/ngx";
import {Platform} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class FavouriteNotesService {
  private db?: SQLiteObject
  private isDbReady = new BehaviorSubject<boolean>(false)
  private favouriteNotes = new BehaviorSubject<Note[]>([])

  constructor(
    private notesService: NotesService,
    private httpClient: HttpClient,
    private platform: Platform,
    private sqlite: SQLite,
    private sqlitePorter: SQLitePorter
  ) {
    this.initDb()
  }

  private initDb() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'notes.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.db = db
        this.createFavouriteNotesTable()
      })
    })
  }

  private createFavouriteNotesTable() {
    this.httpClient.get('/assets/sqlite/db-init.sql', {responseType: "text"}).subscribe(async sql => {
      await this.sqlitePorter.importSqlToDb(this.db, sql)
      await this.loadFavouriteNotes()
      this.isDbReady.next(true)
    })
  }

  private async loadFavouriteNotes() {
    const result = await this.db!.executeSql('SELECT * FROM favourite_notes;')
    const notes: Note[] = []
    if (result.rows.length) {
      for (let i = 0; i < result.rows.length; i++)
        notes.push(this.sqliteRowToNote(result.rows.item(i)))
    }
    this.favouriteNotes.next(notes)
  }

  private noteToSqliteRow(note: Note): any[] {
    return [
      note.title,
      note.content,
      note.creationTimestamp.getTime(),
      note.lastUpdateTimestamp.getTime(),
    ]
  }

  private sqliteRowToNote(row: any): Note {
    return {
      title: row.title,
      content: row.content,
      creationTimestamp: new Date(row.created_at),
      lastUpdateTimestamp: new Date(row.last_updated_at),
    } as Note
  }

  isStorageReady(): Observable<boolean> {
    return this.isDbReady
  }

  getFavouriteNotes(sortingMethod?: NotesSortingMethod): Note[] {
    return this.favouriteNotes.value.sort(this.getSortingFunction(sortingMethod))
  }

  private async deleteAllStoredNotes() {
    await this.db!.executeSql('DELETE FROM favourite_notes;')
  }

  private async addNotes(notes: Note[]) {
    const sql = 'INSERT INTO favourite_notes (title, content, created_at, last_updated_at) VALUES' +
      notes.map(note => ' (?, ?, ?, ?)')
    await this.db!.executeSql(sql, notes.flatMap(this.noteToSqliteRow))
  }

  async storeUserFavouriteNotes() {
    await this.deleteAllStoredNotes()
    const userFavouriteNotes = await firstValueFrom(
      this.notesService.getUserNotes$(NotesDisplayOption.FAVOURITES)
    )
    await this.addNotes(userFavouriteNotes)
  }

  private getSortingFunction(sortingMethod?: NotesSortingMethod): any {
    switch (sortingMethod) {
      case NotesSortingMethod.LAST_UPDATED_FIRST:
        return (note1: Note, note2: Note) => note2.lastUpdateTimestamp.getTime() - note1.lastUpdateTimestamp.getTime()
      case NotesSortingMethod.LAST_UPDATED_LAST:
        return (note1: Note, note2: Note) => note1.lastUpdateTimestamp.getTime() - note2.lastUpdateTimestamp.getTime()
      default:
        return this.getSortingFunction(NotesSortingMethod.DEFAULT)
    }
  }
}
