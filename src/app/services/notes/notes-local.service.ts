import { Injectable } from '@angular/core';
import {SQLite, SQLiteObject} from "@awesome-cordova-plugins/sqlite/ngx";
import {Note} from "../../model/note.model";

@Injectable({
  providedIn: 'root'
})
export class NotesLocalService {
  db?: SQLiteObject

  constructor(private sqlite: SQLite) {
    this.initialiseDatabase()
  }

  private noteToParamsArray(note: Note) {
    return [
      note.localId,
      note.id,
      note.title,
      note.content,
      note.creationTimestamp,
      note.isFavourite ? 1 : 0,
      note.userId
    ]
  }

  async noteWasStoredOnTheCloud(noteLocalId: number, noteId: string, userId: string) {
    await this.initialiseDatabase()
    await this.db!.executeSql(
      'UPDATE notes SET id = ?, userId = ? WHERE localId = ?',
      [noteId, userId, noteLocalId]
    )
  }

  async addNote(note: Note) {
    await this.initialiseDatabase()
    await this.db!.executeSql(
      'INSERT INTO notes (localId, id, title, content, creationTimestamp, isFavourite, userId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      this.noteToParamsArray(note)
    )
  }

  async addNotes(notes: Note[]) {
    await this.initialiseDatabase()
    const sql = 'INSERT INTO notes (localId, id, title, content, creationTimestamp, isFavourite, userId) VALUES ' +
      notes.map(note => '(?, ?, ?, ?, ?, ?, ?)').join(', ')
    const params = notes
      .map(this.noteToParamsArray)
      .reduce((note1, note2) => note1.concat(note2))
    await this.db!.executeSql(sql, params)
  }

  async deleteNote(noteLocalId: number) {
    await this.initialiseDatabase()
    await this.db!.executeSql(
      'DELETE FROM notes WHERE localId = ?',
      [noteLocalId]
    )
  }

  async updateNote(noteLocalId: number, note: Note) {
    await this.initialiseDatabase()
    await this.db!.executeSql(
      'UPDATE notes SET title = ?, content = ? WHERE localId = ?',
      [note.title, note.content, noteLocalId]
    )
  }

  async setIfNoteIsFavourite(noteLocalId: number, isFavourite: boolean) {
    await this.initialiseDatabase()
    await this.db!.executeSql(
      'UPDATE notes SET isFavourite = ? WHERE localId = ?',
      [isFavourite ? 1 : 0, noteLocalId]
    )
  }

  private initialiseDatabase() {
    if (this.db)
      return
    return this.sqlite.create({
      name: 'notes.db',
      location: 'default'
    }).then(db => {
      this.db = db
      this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS notes (
          localId INTEGER PRIMARY KEY AUTOINCREMENT,
          id TEXT UNIQUE,
          title TEXT NOT NULL CHECK (length(title) > 0 AND length(title) < 1000),
          content TEXT CHECK (length(content) > 0 AND length(content) < 100000),
          creationTimestamp INTEGER NOT NULL DEFAULT UNIXEPOCH('now'),
          isFavourite BOOLEAN NOT NULL DEFAULT 0
        );
      `)
        .then(() => console.log('SQLite initialised'))
        .catch((e: any) => console.error(e))
    })
  }
}
