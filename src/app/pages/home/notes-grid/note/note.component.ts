import {Component, Input, OnInit} from '@angular/core';
import {Note} from "../../../../model/note.model";
import {NotesService} from "../../../../services/notes/notes.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent  implements OnInit {
  @Input() note!: Note

  constructor(private notesService: NotesService, private router: Router) { }

  ngOnInit() {}

  async onFavouriteButtonClicked() {
    await this.notesService.toggleNoteIsFavourite(this.note)
  }

  async onEditNoteButtonClicked() {
    await this.router.navigate(['note-editor', { noteId: this.note.id }])
  }

  async onDeleteNotesConfirmationClosed(shouldDeleteNote: boolean) {
    if (shouldDeleteNote)
      await this.notesService.deleteNote(this.note.id)
  }

  getNoteTitlePreview() {
    return this.note.title.length > 50 ? this.note.title.substring(0, 50) + '...' : this.note.title
  }
}
