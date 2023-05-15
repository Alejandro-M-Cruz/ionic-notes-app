import { Injectable } from '@angular/core';
import {Auth, deleteUser} from "@angular/fire/auth";
import {NotesService} from "../notes/notes.service";

@Injectable({
  providedIn: 'root'
})
export class AccountDeletionService {
  constructor(
    private auth: Auth,
    private onlineNotesService: NotesService,
  ) { }

  async deleteUserAccount() {
    await this.onlineNotesService.deleteUserNotesExceptFavourites()
    await deleteUser(this.auth.currentUser!)
  }

}
