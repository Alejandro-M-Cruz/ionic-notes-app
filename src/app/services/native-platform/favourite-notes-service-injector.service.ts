import {inject, Injectable} from '@angular/core';
import {NotesService} from "../notes/notes.service";
import {FavouriteNotesService} from "../notes/favourite-notes.service";

@Injectable({
  providedIn: 'root'
})
export class FavouriteNotesServiceInjectorService {
  constructor(private notesService: NotesService) {}

  injectFavouriteNotesServiceIntoNotesService() {
    this.notesService.setFavouriteNotesService(inject(FavouriteNotesService))
  }
}
