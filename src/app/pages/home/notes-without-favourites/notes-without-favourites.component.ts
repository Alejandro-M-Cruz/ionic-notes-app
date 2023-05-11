import { Component, OnInit } from '@angular/core';
import {NotesService} from "../../../services/notes/notes.service";

@Component({
  selector: 'app-notes-without-favourites',
  templateUrl: './notes-without-favourites.component.html',
  styleUrls: ['./notes-without-favourites.component.scss'],
})
export class NotesWithoutFavouritesComponent  implements OnInit {
  userNotes$ = this.notesService.getUserNotes$()

  constructor(private notesService: NotesService) { }

  ngOnInit() {}

}
