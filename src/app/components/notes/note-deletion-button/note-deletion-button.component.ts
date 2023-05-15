import {Component, Input, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Note} from "../../../model/note.model";
import {NotesService} from "../../../services/notes/notes.service";
import {AlertsService} from "../../../services/alerts/alerts.service";

@Component({
  selector: 'app-note-deletion-button',
  templateUrl: './note-deletion-button.component.html',
  styleUrls: ['./note-deletion-button.component.scss'],
  imports: [IonicModule],
  standalone: true
})
export class NoteDeletionButtonComponent implements OnInit {
  @Input() note!: Note

  constructor(
    private notesService: NotesService,
    private alertsService: AlertsService
  ) { }

  ngOnInit() {}

  private get noteDeletionConfirmationMessage() {
    return `Are you sure you want to delete the note with title "${this.getNoteTitlePreview()}"?`
  }

  private getNoteTitlePreview() {
    return this.note.title.length > 50 ? this.note.title.substring(0, 50) + '...' : this.note.title
  }

  private async onNoteDeletionConfirmationClosed(shouldDeleteNote: boolean) {
    try {
      if (shouldDeleteNote)
        await this.notesService.deleteNote(this.note.id!)
    } catch (e: any) {
      await this.alertsService.showErrorAlert(e)
    }
  }

  async onNoteDeletionButtonClicked() {
    await this.alertsService.showDeleteConfirmationAlert(
      'Deleting note',
      this.noteDeletionConfirmationMessage,
      this.onNoteDeletionConfirmationClosed.bind(this)
    )
  }

}
