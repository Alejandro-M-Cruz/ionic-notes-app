import {Component, OnInit} from '@angular/core';
import {Note} from "../../../model/note.model";
import {Router} from "@angular/router";
import {NotesService} from "../../../services/notes/notes.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-notes-grid',
  templateUrl: './notes-grid.component.html',
  styleUrls: ['./notes-grid.component.scss']
})
export class NotesGridComponent  implements OnInit {
  userNotes$: Observable<Note[]> = this.notesService.getUserNotes$()
  showFavouritesOnly: boolean = false

  constructor(private notesService: NotesService, private router: Router) {}

  ngOnInit() {}

  onShowFavouritesOnlyChanged(favouritesOnly: boolean) {
    if (favouritesOnly === this.showFavouritesOnly)
      return
    this.showFavouritesOnly = favouritesOnly
    this.userNotes$ = favouritesOnly ? this.notesService.getUserFavouriteNotes$() : this.notesService.getUserNotes$()
  }

  async onAddNoteButtonClicked() {
    await this.router.navigate(['note-editor'])
  }

  async onDeleteAllNotesConfirmationClosed(shouldDeleteAllNotes: boolean) {
    if (shouldDeleteAllNotes)
      await this.notesService.deleteAllUserNotes()
  }
}
