import {Component, Input, OnInit} from '@angular/core';
import {Note} from "../../../model/note.model";
import {OnlineNotesService} from "../../../services/notes/online-notes.service";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-note-favourite-button',
  templateUrl: './note-favourite-button.component.html',
  styleUrls: ['./note-favourite-button.component.scss'],
  imports: [
    IonicModule
  ],
  standalone: true
})
export class NoteFavouriteButtonComponent  implements OnInit {
  @Input() note!: Note

  constructor(private notesService: OnlineNotesService) { }

  ngOnInit() {}

  async onFavouriteButtonClicked() {
    await this.notesService.toggleNoteIsFavourite(this.note)
  }
}
