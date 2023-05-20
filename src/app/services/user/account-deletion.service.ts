import { Injectable } from '@angular/core';
import {Auth, deleteUser} from "@angular/fire/auth";
import {NotesService} from "../notes/notes.service";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class AccountDeletionService {
  constructor(
    private auth: Auth,
    private notesService: NotesService,
    private userService: UserService
  ) { }

  async deleteUserAccount() {
    await this.notesService.deleteUserNotesExceptFavourites()
    await this.userService.removeProfilePhoto()
    await deleteUser(this.auth.currentUser!)
  }

}
