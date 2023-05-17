import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from "@awesome-cordova-plugins/sqlite/ngx";
import {Note, NotesFilteringOption, NotesSortingMethod} from "../../model/note.model";
import {NotesService} from "./notes.service";
import {BehaviorSubject, firstValueFrom, map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {SQLitePorter} from "@awesome-cordova-plugins/sqlite-porter/ngx";
import {Platform} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class FavouriteNotesService {
  private db?: SQLiteObject
  private favouriteNotes$ = new BehaviorSubject<Note[]>([])

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
    if (this.db)
      return
    return this.platform.ready().then(() => {
      return this.sqlite.create({
        name: 'notes.db',
        location: 'default'
      })
    }).then((db: SQLiteObject) => {
      return this.createFavouriteNotesTable(db)
    })
  }

  private async createFavouriteNotesTable(db: SQLiteObject) {
    const sql = await firstValueFrom(
      this.httpClient.get('/assets/sqlite/db-init.sql', {responseType: "text"})
    )
    await this.sqlitePorter.importSqlToDb(db, sql)
    this.db = db
    await this.loadFavouriteNotes()
  }

  private async loadFavouriteNotes() {
    const result = await this.db!.executeSql('SELECT * FROM favourite_notes;', [])
    const notes: Note[] = []
    if (result.rows.length) {
      for (let i = 0; i < result.rows.length; i++)
        notes.push(this.sqliteRowToNote(result.rows.item(i)))
    }
    this.favouriteNotes$.next(notes)
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

  getFavouriteNotes$(sortingMethod?: NotesSortingMethod): Observable<Note[]> {
    return this.favouriteNotes$.pipe(
      map(favouriteNotes => favouriteNotes.sort(this.getSortingFunction(sortingMethod)))
    )
  }

  private async deleteAllStoredNotes() {
    await this.initDb()
    await this.db!.executeSql('DELETE FROM favourite_notes;', [])
  }

  private async addNotes(notes: Note[]) {
    if (notes.length === 0)
      return
    await this.initDb()
    const sql = 'INSERT INTO favourite_notes (title, content, created_at, last_updated_at) VALUES' +
      notes.map(note => ' (?, ?, ?, ?)')
    await this.db!.executeSql(sql, notes.flatMap(this.noteToSqliteRow))
  }

  async storeUserFavouriteNotes() {
    await this.deleteAllStoredNotes()
    const userFavouriteNotes = await firstValueFrom(
      this.notesService.getUserNotes$(NotesFilteringOption.FAVOURITES)
    )
    await this.addNotes(userFavouriteNotes)
    await this.loadFavouriteNotes()
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
