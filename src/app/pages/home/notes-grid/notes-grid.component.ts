import {Component, OnInit} from '@angular/core';
import {Note, NotesSortingMethod} from "../../../model/note.model";
import {Router} from "@angular/router";
import {OnlineNotesService} from "../../../services/notes/online-notes.service";
import {Observable} from "rxjs";
import {AlertsService} from "../../../services/alerts/alerts.service";
import {ErrorsService} from "../../../services/alerts/errors.service";

@Component({
  selector: 'app-notes-grid',
  templateUrl: './notes-grid.component.html',
  styleUrls: ['./notes-grid.component.scss']
})
export class NotesGridComponent  implements OnInit {
  showFavouritesOnly: boolean = false
  userNotes$: Observable<Note[]> = this.notesService.getUserNotes$(this.showFavouritesOnly)
  notesSortingMethod = NotesSortingMethod.DEFAULT

  constructor(
    private notesService: OnlineNotesService,
    private errorsService: ErrorsService,
    private alertsService: AlertsService,
    private router: Router
  ) {}

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

  async onNotesDeletionConfirmationClosed(shouldDeleteAllNotes: boolean) {
    try {
      if (shouldDeleteAllNotes) {
        this.showFavouritesOnly ?
          await this.notesService.deleteUserFavouriteNotes() :
          await this.notesService.deleteAllUserNotes()
      }
    } catch (e: any) {
      await this.alertsService.showErrorAlert(this.errorsService.identifyError(e))
    }
  }

  private get notesDeletionConfirmationTitle() {
    return this.showFavouritesOnly ? 'Deleting favourite notes' : 'Deleting all notes'
  }

  private get notesDeletionConfirmationMessage() {
    return this.showFavouritesOnly ?
      'Are you sure you want to delete all your favourite notes?' :
      'Are you sure you want to delete all your notes?'
  }

  async onNotesDeletionButtonClicked() {
    await this.alertsService.showDeleteConfirmationAlert(
      this.notesDeletionConfirmationTitle,
      this.notesDeletionConfirmationMessage,
      this.onNotesDeletionConfirmationClosed.bind(this)
    )
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
