import {Component, OnDestroy, OnInit} from '@angular/core';
import {Note, NotesSortingMethod} from "../../model/note.model";
import {LocalNotesService} from "../../services/notes/local-notes.service";
import {Subscription} from "rxjs";
import { AlertsService } from 'src/app/services/alerts/alerts.service';

@Component({
  selector: 'app-no-connection',
  templateUrl: './no-connection.page.html',
  styleUrls: ['./no-connection.page.scss'],
})
export class NoConnectionPage implements OnInit, OnDestroy {
  notesSortingMethod = NotesSortingMethod.DEFAULT
  favouriteNotes?: Note[]
  favouriteNotesSubscription?: Subscription
  private readonly offlineModeInformationMessage =
    'In offline mode, you can access your favourite notes, which are automatically saved when you are connected.'

  constructor(private localNotesService: LocalNotesService, private alertsService: AlertsService) { }

  ngOnInit() {
    this.loadFavouriteNotes()
  }

  private loadFavouriteNotes() {
    this.favouriteNotesSubscription = this.localNotesService.getNotes$(this.notesSortingMethod)
      .subscribe(favouriteNotes => {
        this.favouriteNotes = favouriteNotes
      })
  }

  changeNotesOrder() {
    this.notesSortingMethod = this.notesSortingMethod === NotesSortingMethod.LAST_UPDATED_FIRST ?
      NotesSortingMethod.LAST_UPDATED_LAST :
      NotesSortingMethod.LAST_UPDATED_FIRST
    this.loadFavouriteNotes()
  }

  async onInformationButtonClicked() {
    await this.alertsService.showInformationAlert('Offline mode', this.offlineModeInformationMessage)
  }

  ngOnDestroy() {
    this.favouriteNotesSubscription?.unsubscribe()
  }
}
