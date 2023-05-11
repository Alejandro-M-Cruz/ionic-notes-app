import { Injectable } from '@angular/core';
import {NotesService} from "./notes/notes.service";

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  constructor(private notesService: NotesService) { }

  destroySubscriptions() {
    this.notesService.destroySubscriptions()
  }
}
