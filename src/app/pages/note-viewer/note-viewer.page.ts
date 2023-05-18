import {Component} from '@angular/core';
import {Note} from "../../model/note.model";
import {ActivatedRoute} from "@angular/router";
import {LocalNotesService} from "../../services/notes/local-notes.service";
import {Subscription} from "rxjs";
import {ViewWillEnter, ViewWillLeave} from "@ionic/angular";

@Component({
  selector: 'app-note-viewer',
  templateUrl: './note-viewer.page.html',
  styleUrls: ['./note-viewer.page.scss'],
})
export class NoteViewerPage implements ViewWillEnter, ViewWillLeave {
  noteId?: string
  note?: Note
  private noteSubscription?: Subscription

  constructor(private route: ActivatedRoute, private localNotesService: LocalNotesService) { }

  ionViewWillEnter() {
    this.getNoteIdFromRouteParams()
    this.getNoteById()
  }

  private getNoteIdFromRouteParams() {
    this.noteId = this.route.snapshot.paramMap.get('noteId')!
  }

  private getNoteById() {
    this.noteSubscription = this.localNotesService.getNoteById$(this.noteId!)
      .subscribe(note => {
        this.note = note
      })
  }

  ionViewWillLeave() {
    this.noteSubscription?.unsubscribe()
  }
}
