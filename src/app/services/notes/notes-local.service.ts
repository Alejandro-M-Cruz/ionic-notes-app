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
      note.lastUpdateTimestamp,
      note.isFavourite ? 1 : 0,
      note.userId
    ]
  }

  private sortByLastUpdateTimestamp(note1: Note, note2: Note, direction: 'asc' | 'desc' = 'desc') {
    return note1.lastUpdateTimestamp.getTime() > note2.lastUpdateTimestamp.getTime() ? 1 : -1
  }

  async noteWasStoredOnTheCloud(noteLocalId: number, noteId: string, userId: string) {
    await this.initialiseDatabase()
    await this.db!.executeSql(
      'UPDATE notes SET id = ?, userId = ? WHERE localId = ?',
      [noteId, userId, noteLocalId]
    )
  }

  async getNotes(): Promise<Note[]> {
    await this.initialiseDatabase()
    const result = await this.db!.executeSql(
      'SELECT * FROM notes WHERE localId = ?',
      [localId]
    )
    return (result.rows as Note[]).sort(this.sortByLastUpdateTimestamp)
  }

  async getNoteByLocalId(localId: number): Promise<Note> {
    await this.initialiseDatabase()
    const result = await this.db!.executeSql(
      'SELECT * FROM notes WHERE localId = ?',
      [localId]
    )
    return result.rows.item(0)
  }

  async addNote(note: Note) {
    await this.initialiseDatabase()
    await this.db!.executeSql(
      'INSERT INTO notes (localId, id, title, content, lastUpdateTimestamp, isFavourite, userId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      this.noteToParamsArray(note)
    )
  }

  async addNotes(notes: Note[]) {
    await this.initialiseDatabase()
    const sql = 'INSERT INTO notes (localId, id, title, content, lastUpdateTimestamp, isFavourite, userId) VALUES ' +
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

  async deleteNotes(notesLocalIds: number[]) {
    await this.initialiseDatabase()
    const sql = 'DELETE FROM notes WHERE localId IN (' + notesLocalIds.map(localId => '?').join(', ') + ')'
    await this.db!.executeSql(sql, notesLocalIds)
  }

  async updateNote(noteLocalId: number, note: Note) {
    await this.initialiseDatabase()
    await this.db!.executeSql(
      'UPDATE notes SET title = ?, content = ? WHERE localId = ?',
      [note.title, note.content, noteLocalId]
    )
  }

  async updateNotes(notes: Note[]) {
    await this.initialiseDatabase()
    for (const note of notes)
      await this.updateNote(note.localId!, note)
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
          lastUpdateTimestamp INTEGER NOT NULL DEFAULT UNIXEPOCH('now'),
          isFavourite BOOLEAN NOT NULL DEFAULT 0
        );
      `)
        .then(() => console.log('SQLite initialised'))
        .catch((e: any) => console.error(e))
    })
  }
}
