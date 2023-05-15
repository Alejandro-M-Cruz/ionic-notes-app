import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from "@awesome-cordova-plugins/sqlite/ngx";
import {Note, NotesDisplayOption, NotesSortingMethod} from "../../model/note.model";
import {NotesService} from "./notes.service";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FavouriteNotesService {
  db?: SQLiteObject
  favouriteNotes?: Note[]
  notesSortingMethod = NotesSortingMethod.DEFAULT

  constructor(private sqlite: SQLite, private notesService: NotesService) {
    this.initialiseDatabase()
  }

  private noteToSqliteRow = (note: Note): any[] => {
    return [
      note.title,
      note.content,
      note.creationTimestamp.getTime(),
      note.lastUpdateTimestamp.getTime(),
    ]
  }

  private sqliteRowToNote = (row: any): Note => {
    return {
      title: row.title,
      content: row.content,
      creationTimestamp: new Date(row.created_at),
      lastUpdateTimestamp: new Date(row.last_updated_at),
    } as Note
  }

  private async loadFavouriteNotes(sortingMethod?: NotesSortingMethod) {
    const result = await this.db!.executeSql('SELECT * FROM favourite_notes;')
    this.favouriteNotes = result.rows.map(this.sqliteRowToNote).sort(this.getSortingFunction)
    this.notesSortingMethod = sortingMethod ?? NotesSortingMethod.DEFAULT
  }

  private getSortedNotes(sortingMethod?: NotesSortingMethod): Note[] {
    if (!sortingMethod)
      sortingMethod = NotesSortingMethod.DEFAULT
    return this.notesSortingMethod === sortingMethod ?
      this.favouriteNotes! :
      this.favouriteNotes!.sort(this.getSortingFunction(this.notesSortingMethod = sortingMethod))
  }

  async getFavouriteNotes(sortingMethod?: NotesSortingMethod) {
    if (!this.favouriteNotes) {
      await this.initialiseDatabase()
      await this.loadFavouriteNotes(sortingMethod)
    }
    return this.getSortedNotes(sortingMethod)
  }

  async storeUserFavouriteNotes() {
    await this.initialiseDatabase()
    const notes = await firstValueFrom(this.notesService.getUserNotes$(NotesDisplayOption.FAVOURITES))
    await this.addNotes(notes)
  }

  private async addNotes(notes: Note[]) {
    await this.initialiseDatabase()
    const sql = 'INSERT INTO favourite_notes (title, content, created_at, last_updated_at) VALUES' +
      notes.map(note => ' (?, ?, ?, ?)')
    await this.db!.executeSql(sql, notes.flatMap(this.noteToSqliteRow))
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
      name: 'notes.db',
      location: 'default'
    }).then(db => {
      this.db = db
      this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS favourite_notes (
          id INT PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at INT NOT NULL,
          last_updated_at INT NOT NULL
        );
      `)
        .then(() => console.log('SQLite initialised'))
        .catch((e: any) => console.error(e))
    })
  }
}
