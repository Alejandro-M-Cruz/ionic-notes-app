import { Component, OnInit } from '@angular/core';
import {Note, NotesSortingMethod} from "../../model/note.model";
import {FavouriteNotesService} from "../../services/notes/favourite-notes.service";
import {Capacitor} from "@capacitor/core";

@Component({
  selector: 'app-no-connection',
  templateUrl: './no-connection.page.html',
  styleUrls: ['./no-connection.page.scss'],
})
export class NoConnectionPage implements OnInit {
  favouriteNotes: Note[] = []
  isNativePlatform: boolean = Capacitor.isNativePlatform()
  notesSortingMethod = NotesSortingMethod.DEFAULT

  constructor(private favouriteNotesService: FavouriteNotesService) { }

  async ngOnInit() {
    await this.loadFavouriteNotes()
  }

  private async loadFavouriteNotes() {
    this.favouriteNotes = await this.favouriteNotesService.getFavouriteNotes(this.notesSortingMethod)
  }

  async changeNotesOrder() {
    this.notesSortingMethod = this.notesSortingMethod === NotesSortingMethod.LAST_UPDATED_FIRST ?
      NotesSortingMethod.LAST_UPDATED_LAST :
      NotesSortingMethod.LAST_UPDATED_FIRST
    await this.loadFavouriteNotes()
  }
}
