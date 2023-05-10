import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Note, NoteDisplayOptions} from "../../../model/note.model";
import {NotesCloudService} from "../../../services/notes/notes-cloud.service";

@Component({
  selector: 'app-notes-grid',
  templateUrl: './notes-grid.component.html',
  styleUrls: ['./notes-grid.component.scss']
})
export class NotesGridComponent  implements OnInit {
  defaultNoteDisplayOption = NoteDisplayOptions.ALL
  notes$: Observable<Note[]> = this.notesCloudService.getUserNotes$(this.defaultNoteDisplayOption)

  constructor(private notesCloudService: NotesCloudService) {}

  ngOnInit() {}

  onNoteDisplayOptionChanged(noteDisplayOption: NoteDisplayOptions) {
    this.notes$ = this.notesCloudService.getUserNotes$(noteDisplayOption)
  }
}
