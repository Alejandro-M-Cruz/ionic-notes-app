import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Note, NotesDisplayOption, NotesSortingMethod} from "../../model/note.model";
import {UserService} from "../../services/user/user.service";
import {OnlineNotesService} from "../../services/notes/online-notes.service";
import {ErrorsService} from "../../services/alerts/errors.service";
import {AlertsService} from "../../services/alerts/alerts.service";
import {Router} from "@angular/router";
import {Capacitor} from "@capacitor/core";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {
  displayOption = NotesDisplayOption.DEFAULT
  notesSortingMethod = NotesSortingMethod.DEFAULT
  userNotes$: Observable<Note[]> = this.notesService.getUserNotes$(this.displayOption, this.notesSortingMethod)
  readonly isNativePlatform = Capacitor.isNativePlatform()

  constructor(
    private userService: UserService,
    private notesService: OnlineNotesService,
    private errorsService: ErrorsService,
    private alertsService: AlertsService,
    private router: Router
  ) {}

  ngOnInit() {}

  onDisplayOptionChanged(displayOption: NotesDisplayOption) {
    if (displayOption === this.displayOption)
      return
    this.displayOption = displayOption
    this.userNotes$ = this.notesService.getUserNotes$(displayOption, this.notesSortingMethod)
  }

  async onAddNoteButtonClicked() {
    await this.router.navigate(['note-editor'])
  }

  async onNotesDeletionConfirmationClosed(shouldDeleteNotes: boolean) {
    try {
      if (shouldDeleteNotes) {
        this.displayOption === NotesDisplayOption.FAVOURITES ?
          await this.notesService.deleteUserFavouriteNotes() :
          await this.notesService.deleteUserNotesExceptFavourites()
      }
    } catch (e: any) {
      await this.alertsService.showErrorAlert(this.errorsService.identifyError(e))
    }
  }

  private get notesDeletionConfirmationTitle() {
    return this.displayOption === NotesDisplayOption.FAVOURITES ?
      'Deleting all favourite notes' :
      'Deleting all notes except favourites'
  }

  private get notesDeletionConfirmationMessage() {
    return this.displayOption === NotesDisplayOption.FAVOURITES ?
      'Are you sure you want to delete all your favourite notes?' :
      'Are you sure you want to delete all your notes except favourites?'
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
    this.userNotes$ = this.notesService.getUserNotes$(this.displayOption, this.notesSortingMethod)
  }
}
