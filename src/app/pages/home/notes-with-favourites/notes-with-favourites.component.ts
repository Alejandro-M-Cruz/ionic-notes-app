import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Note} from "../../../model/note.model";
import {NotesService} from "../../../services/notes/notes.service";

@Component({
  selector: 'app-notes-with-favourites',
  templateUrl: './notes-with-favourites.component.html',
  styleUrls: ['./notes-with-favourites.component.scss'],
})
export class NotesWithFavouritesComponent implements OnInit {
  userNotes$: Observable<Note[]> = this.notesService.getUserNotes$()
  showFavouritesOnly: boolean = false

  constructor(private notesService: NotesService) {}

  ngOnInit() {}

  onShowFavouritesOnlyChanged(showFavouritesOnly: boolean) {
    this.showFavouritesOnly = showFavouritesOnly
    this.userNotes$ = this.notesService.getUserNotes$()
  }
}
