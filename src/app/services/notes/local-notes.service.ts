import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from "@awesome-cordova-plugins/sqlite/ngx";
import {Note, NotesSortingMethod} from "../../model/note.model";
import {BehaviorSubject, firstValueFrom, map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {SQLitePorter} from "@awesome-cordova-plugins/sqlite-porter/ngx";
import {Platform} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class LocalNotesService {
  private db?: SQLiteObject
  private notes$ = new BehaviorSubject<Note[]>([])

  constructor(
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
      return this.createTable(db)
    })
  }

  private async createTable(db: SQLiteObject) {
    const sql = await firstValueFrom(
      this.httpClient.get('/assets/sqlite/db-init.sql', {responseType: "text"})
    )
    await this.sqlitePorter.importSqlToDb(db, sql)
    this.db = db
    await this.loadNotes()
  }

  private async loadNotes() {
    const result = await this.db!.executeSql(`
      SELECT
        id,
        title,
        content,
        creation_timestamp,
        last_update_timestamp,
        datetime(local_storage_timestamp, 'localtime') as local_storage_timestamp
      FROM notes;`, []
    )
    const notes: Note[] = []
    if (result.rows.length) {
      for (let i = 0; i < result.rows.length; i++)
        notes.push(this.sqliteRowToNote(result.rows.item(i)))
    }
    this.notes$.next(notes)
  }

  private noteToSqliteRow(note: Note): any[] {
    return [
      note.id,
      note.title,
      note.content,
      note.creationTimestamp.getTime(),
      note.lastUpdateTimestamp.getTime(),
    ]
  }

  private sqliteRowToNote(row: any): Note {
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      creationTimestamp: new Date(row.creation_timestamp),
      lastUpdateTimestamp: new Date(row.last_update_timestamp),
      localStorageTimestamp: new Date(row.local_storage_timestamp)
    } as Note
  }

  getNotes$(sortingMethod?: NotesSortingMethod): Observable<Note[]> {
    return this.notes$.pipe(
      map(notes => notes.sort(this.getSortingFunction(sortingMethod)))
    )
  }

  getNoteById$(noteId: string): Observable<Note | undefined> {
    return this.notes$.pipe(map(notes => notes.find(note => note.id === noteId)))
  }

  async deleteAllStoredNotes() {
    await this.initDb()
    await this.db!.executeSql('DELETE FROM notes;', [])
  }

  private async addNotes(notes: Note[]) {
    if (notes.length === 0)
      return
    const sql = 'INSERT INTO notes (id, title, content, creation_timestamp, last_update_timestamp) VALUES' +
      notes.map(note => ' (?, ?, ?, ?, ?)') + ';'
    await this.db!.executeSql(sql, notes.flatMap(this.noteToSqliteRow))
  }

  async storeNotes(notes: Note[]) {
    await this.deleteAllStoredNotes()
    await this.addNotes(notes)
    await this.loadNotes()
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
