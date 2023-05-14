import { Injectable } from '@angular/core';
import {SQLite, SQLiteObject} from "@awesome-cordova-plugins/sqlite/ngx";
import {Note, NotesSortingMethod} from "../../model/note.model";
import {BehaviorSubject, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OfflineNotesService {
  db?: SQLiteObject
  notes$ = new BehaviorSubject<Note[]>([])

  constructor(private sqlite: SQLite) {
    this.initialiseDatabase()
    this.loadNotes()
  }

  private sqliteRowToNote = (row: any): Note => {
    return {
      id: row.id,
      localId: row.local_id,
      title: row.title,
      content: row.content,
      isFavourite: row.is_favourite === 1,
      creationTimestamp: new Date(row.created_at),
      lastUpdateTimestamp: new Date(row.last_updated_at),
      userId: row.user_id
    }
  }

  private noteToSqliteRow = (note: Note): any[] => {
    return [
      note.id,
      note.title,
      note.content,
      note.isFavourite ? 1 : 0,
      note.creationTimestamp.getTime(),
      note.lastUpdateTimestamp.getTime(),
      note.userId
    ]
  }

  private loadNotes() {
    this.getNotesFromSqlite().then(notes => this.notes$.next(notes))
  }

  private async getNotesFromSqlite(): Promise<Note[]> {
    await this.initialiseDatabase()
    return this.db!.executeSql('SELECT * FROM notes;').then(result => {
      console.log(result)
      return result.rows.map(this.sqliteRowToNote)
    })
  }

  getNotes$(sortingMethod?: NotesSortingMethod): Observable<Note[]> {
    return this.notes$.pipe(
      map(notes => notes.sort(this.getSortingFunction(sortingMethod)))
    )
  }

  getFavouriteNotes$(sortingMethod?: NotesSortingMethod): Observable<Note[]> {
    return this.notes$.pipe(
      map(notes => notes.filter(note => note.isFavourite)),
      map(favourites => favourites.sort(this.getSortingFunction(sortingMethod)))
    )
  }

  getNotesQuantity$(): Observable<number> {
    return this.notes$.pipe(map(notes => notes.length))
  }

  getFavouriteNotesQuantity$(): Observable<number> {
    return this.notes$.pipe(map(notes => notes.filter(note => note.isFavourite).length))
  }

  getNoteById(noteId: string): Observable<Note | undefined> {
    return this.notes$.pipe(map(notes => notes.find(note => note.id === noteId)))
  }

  async deleteAllNotes() {
    await this.initialiseDatabase()
    await this.db!.executeSql('DELETE FROM notes;')
  }

  async deleteFavouriteNotes() {
    await this.initialiseDatabase()
    await this.db!.executeSql('DELETE FROM notes WHERE is_favourite = 1;')
  }

  async addNote(note: Note) {
    await this.initialiseDatabase()
    const sql = 'INSERT INTO notes (title, content, is_favourite, user_id) VALUES (?, ?, ?, ?);'
    await this.db!.executeSql(sql, [note.title, note.content, note.isFavourite, note.userId])
  }

  async deleteNote(noteLocalId: number) {
    await this.initialiseDatabase()
    const sql = 'DELETE FROM notes WHERE local_id = ?;'
    await this.db!.executeSql(sql, [noteLocalId])
  }

  async updateNote(noteLocalId: number, note: Note) {
    await this.initialiseDatabase()
    const sql = 'UPDATE notes SET title = ?, content = ?, is_favourite = ?, last_updated_at = ? WHERE local_id = ?;'
    await this.db!.executeSql(sql, [note.id, note.title, note.content, note.isFavourite, Date.now(), noteLocalId])
  }

  async toggleNoteIsFavourite(note: Note) {
    await this.initialiseDatabase()
    const sql = 'UPDATE notes SET is_favourite = ? WHERE local_id = ?;'
    await this.db!.executeSql(sql, [note.isFavourite ? 0 : 1, note.localId])
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

  private initialiseDatabase() {
    if (this.db)
      return
    return this.sqlite!.create({
      name: 'favourites.db',
      location: 'default'
    }).then(db => {
      this.db = db
      this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS notes (
          local_id INT PRIMARY KEY AUTOINCREMENT,
          id INT UNIQUE,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          is_favourite BOOLEAN NOT NULL DEFAULT 0,
          created_at INT NOT NULL DEFAULT UNIXEPOCH('now'),
          last_updated_at INT NOT NULL DEFAULT UNIXEPOCH('now'),
          user_id TEXT
        );
      `)
        .then(() => console.log('SQLite initialised'))
        .catch((e: any) => console.error(e))
    })
  }
}
