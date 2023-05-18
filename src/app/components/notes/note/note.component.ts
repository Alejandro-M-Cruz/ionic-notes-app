import {Component, Input} from '@angular/core';
import {Note} from "../../../model/note.model";
import {Router} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import {NoteFavouriteButtonComponent} from "../note-favourite-button/note-favourite-button.component";
import {NoteDeletionButtonComponent} from "../note-deletion-button/note-deletion-button.component";
import {DatePipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  imports: [
    IonicModule,
    NoteFavouriteButtonComponent,
    NoteDeletionButtonComponent,
    NgIf,
    DatePipe
  ],
  standalone: true
})
export class NoteComponent {
  @Input() note!: Note
  @Input() isEditable: boolean = true

  constructor(private router: Router) { }

  async onEditNoteButtonClicked() {
    await this.router.navigate(['/note-editor', { noteId: this.note.id! }])
  }

  async onViewNoteButtonClicked() {
    await this.router.navigate(['/note-viewer', { noteId: this.note.id! }])
  }
}
