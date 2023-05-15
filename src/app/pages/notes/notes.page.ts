import {Component} from '@angular/core';
import {Note, NotesDisplayOption, NotesSortingMethod} from "../../model/note.model";
import {UserService} from "../../services/user/user.service";
import {NotesService} from "../../services/notes/notes.service";
import {AlertsService} from "../../services/alerts/alerts.service";
import {Router} from "@angular/router";
import {ViewWillEnter, ViewWillLeave} from "@ionic/angular";
import {Subscription} from "rxjs";
import {PlatformService} from "../../services/native-platform/platform.service";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements ViewWillEnter, ViewWillLeave {
  displayOption = NotesDisplayOption.DEFAULT
  notesSortingMethod = NotesSortingMethod.DEFAULT
  userNotes?: Note[]
  private userNotesSubscription?: Subscription
  readonly isNativePlatform = this.platformService.isNativePlatform()

  constructor(
    private userService: UserService,
    private notesService: NotesService,
    private alertsService: AlertsService,
    private platformService: PlatformService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.subscribeToUserNotes()
  }

  ionViewWillLeave() {
    this.userNotesSubscription?.unsubscribe()
  }

  private subscribeToUserNotes() {
    this.userNotesSubscription?.unsubscribe()
    this.userNotesSubscription = this.notesService.getUserNotes$(this.displayOption, this.notesSortingMethod)
      .subscribe(userNotes => {
        this.userNotes = userNotes
      })
  }

  onDisplayOptionChanged(displayOption: NotesDisplayOption) {
    if (displayOption === this.displayOption)
      return
    this.displayOption = displayOption
    this.subscribeToUserNotes()
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
      await this.alertsService.showErrorAlert(e)
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

  changeNotesOrder() {
    this.notesSortingMethod = this.notesSortingMethod === NotesSortingMethod.LAST_UPDATED_FIRST ?
      NotesSortingMethod.LAST_UPDATED_LAST :
      NotesSortingMethod.LAST_UPDATED_FIRST
    this.subscribeToUserNotes()
  }

}
