import {Component, OnDestroy, OnInit} from '@angular/core';
import {Note, NotesSortingMethod} from "../../model/note.model";
import {LocalNotesService} from "../../services/notes/local-notes.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-no-connection',
  templateUrl: './no-connection.page.html',
  styleUrls: ['./no-connection.page.scss'],
})
export class NoConnectionPage implements OnInit, OnDestroy {
  notesSortingMethod = NotesSortingMethod.DEFAULT
  favouriteNotes?: Note[]
  favouriteNotesSubscription?: Subscription

  constructor(private favouriteNotesService: LocalNotesService) { }

  ngOnInit() {
    this.loadFavouriteNotes()
  }

  private loadFavouriteNotes() {
    this.favouriteNotesSubscription = this.favouriteNotesService.getNotes$(this.notesSortingMethod)
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

  ngOnDestroy() {
    this.favouriteNotesSubscription?.unsubscribe()
  }
}
