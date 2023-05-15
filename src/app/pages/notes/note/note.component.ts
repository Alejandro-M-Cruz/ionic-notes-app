import {Component, Input, OnInit} from '@angular/core';
import {Note} from "../../../model/note.model";
import {NotesService} from "../../../services/notes/notes.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent  implements OnInit {
  @Input() note!: Note
  @Input() isEditable: boolean = true

  constructor(private notesService: NotesService, private router: Router) { }

  ngOnInit() {}

  async onEditNoteButtonClicked() {
    await this.router.navigate(['note-editor', { noteId: this.note.id! }])
  }

}
