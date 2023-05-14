import {Component, Input, OnInit} from '@angular/core';
import {Note} from "../../../../model/note.model";
import {OnlineNotesService} from "../../../../services/notes/online-notes.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent  implements OnInit {
  @Input() note!: Note

  constructor(private notesService: OnlineNotesService, private router: Router) { }

  ngOnInit() {}

  async onEditNoteButtonClicked() {
    await this.router.navigate(['note-editor', { noteId: this.note.id! }])
  }

}
