import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {Observable} from "rxjs";
import {Note, NotesSortingMethod} from "../../model/note.model";
import {OnlineNotesService} from "../../services/notes/online-notes.service";
import {ErrorsService} from "../../services/alerts/errors.service";
import {AlertsService} from "../../services/alerts/alerts.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  currentUser$ = this.userService.currentUser$
  showFavouritesOnly: boolean = false
  userNotes$?: Observable<Note[]>
  notesSortingMethod = NotesSortingMethod.DEFAULT

  constructor(
    private userService: UserService,
    private notesService: OnlineNotesService,
    private errorsService: ErrorsService,
    private alertsService: AlertsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getUserNotesWhenUserIsLoaded()
  }

  private getUserNotesWhenUserIsLoaded() {
    const userSubscription = this.currentUser$.subscribe(user => {
      if (user) {
        this.userNotes$ = this.notesService.getUserNotes$(this.showFavouritesOnly, this.notesSortingMethod)
        userSubscription.unsubscribe()
      }
    })
  }

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
