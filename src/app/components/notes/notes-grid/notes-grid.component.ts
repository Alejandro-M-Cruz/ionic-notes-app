import {Component, Input} from '@angular/core';
import {Note, NotesFilteringOption} from "../../../model/note.model";
import {NgForOf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {NoteComponent} from "../note/note.component";

@Component({
  selector: 'app-notes-grid',
  templateUrl: './notes-grid.component.html',
  styleUrls: ['./notes-grid.component.scss'],
  imports: [
    NgSwitch,
    IonicModule,
    NgForOf,
    NgSwitchCase,
    NoteComponent,
    NgSwitchDefault
  ],
  standalone: true
})
export class NotesGridComponent {
  @Input() notes: Note[] | undefined
  @Input() displayOption: NotesFilteringOption | string = NotesFilteringOption.DEFAULT
  @Input() notesAreEditable!: boolean

  constructor() { }

}
