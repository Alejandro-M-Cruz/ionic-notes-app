import {Component, OnInit} from '@angular/core';
import {Note, NotesSortingMethod} from "../../../model/note.model";
import {Router} from "@angular/router";
import {NotesService} from "../../../services/notes/notes.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-notes-grid',
  templateUrl: './notes-grid.component.html',
  styleUrls: ['./notes-grid.component.scss']
})
export class NotesGridComponent  implements OnInit {
  showFavouritesOnly: boolean = false
  userNotes$: Observable<Note[]> = this.notesService.getUserNotes$(this.showFavouritesOnly)
  notesSortingMethod = NotesSortingMethod.DEFAULT

  constructor(private notesService: NotesService, private router: Router) {}

  ngOnInit() {}

  onShowFavouritesOnlyChanged(favouritesOnly: boolean) {
    if (favouritesOnly === this.showFavouritesOnly)
      return
    this.showFavouritesOnly = favouritesOnly
    this.userNotes$ = this.notesService.getUserNotes$(favouritesOnly, this.notesSortingMethod)
  }

  async onAddNoteButtonClicked() {
    await this.router.navigate(['note-editor'])
  }

  async onDeleteConfirmationClosed(shouldDeleteAllNotes: boolean) {
    if (shouldDeleteAllNotes) {
      this.showFavouritesOnly ?
        await this.notesService.deleteUserFavouriteNotes() :
        await this.notesService.deleteAllUserNotes()
    }
  }

  revertNotesOrder() {
    this.notesSortingMethod = this.notesSortingMethod === NotesSortingMethod.LAST_UPDATED_FIRST ?
      NotesSortingMethod.LAST_UPDATED_LAST :
      NotesSortingMethod.LAST_UPDATED_FIRST
    this.userNotes$ = this.notesService.getUserNotes$(
      this.showFavouritesOnly,
      this.notesSortingMethod
    )
  }
}
