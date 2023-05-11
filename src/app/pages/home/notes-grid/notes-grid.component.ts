import {Component, Input, OnInit} from '@angular/core';
import {Note} from "../../../model/note.model";

@Component({
  selector: 'app-notes-grid',
  templateUrl: './notes-grid.component.html',
  styleUrls: ['./notes-grid.component.scss']
})
export class NotesGridComponent  implements OnInit {
  @Input() notes: Note[] | null = null

  constructor() {}

  ngOnInit() {}

}
