import { Injectable } from '@angular/core';
import {Auth, deleteUser} from "@angular/fire/auth";
import {NotesService} from "../notes/notes.service";

@Injectable({
  providedIn: 'root'
})
export class AccountDeletionService {
  constructor(
    private auth: Auth,
    private notesService: NotesService,
  ) { }

  async deleteUserAccount() {
    await this.notesService.deleteAllUserNotes()
    await deleteUser(this.auth.currentUser!)
  }

}
