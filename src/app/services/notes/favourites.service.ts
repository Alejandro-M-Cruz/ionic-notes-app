import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from "@awesome-cordova-plugins/sqlite/ngx";
import {NotesService} from "./notes.service";
import {from, map, Observable, zip} from "rxjs";
import {Note} from "../../model/note.model";

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {
  db?: SQLiteObject

  constructor(private notesService: NotesService, private sqlite: SQLite) {
    this.initialiseDatabase()
  }

  async addFavourite(noteId: string) {
    await this.initialiseDatabase()
    await this.db!.executeSql('INSERT INTO favourites (note_id) VALUES (?);', [noteId])
  }

  async removeFavourite(noteId: string) {
    await this.initialiseDatabase()
    await this.db!.executeSql('DELETE FROM favourites WHERE note_id = ?;', [noteId])
  }

  private async getFavouriteNotesIds(): Promise<string[]> {
    await this.initialiseDatabase()
    return this.db!.executeSql('SELECT * FROM favourites;')
      .then(data => data.map((favourite: any) => favourite.note_id) as string[])
  }

  getUserFavouriteNotes$(): Observable<Note[]> {
    return zip(
      this.notesService.getUserNotes$(),
      from(this.getFavouriteNotesIds())
    ).pipe(map(([userNotes, favouriteNotesIds]) => {
      return userNotes.filter(note => favouriteNotesIds.includes(note.id!))
    }))
  }

  private initialiseDatabase() {
    if (this.db)
      return
    return this.sqlite!.create({
      name: 'favourites.db',
      location: 'default'
    }).then(db => {
      this.db = db
      this.db.executeSql('CREATE TABLE IF NOT EXISTS favourites (note_id TEXT PRIMARY KEY);')
        .then(() => console.log('SQLite initialised'))
        .catch((e: any) => console.error(e))
    })
  }
}
