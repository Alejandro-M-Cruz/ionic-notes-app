import { Injectable } from '@angular/core';
import {Auth, deleteUser} from "@angular/fire/auth";
import {OnlineNotesService} from "../notes/online-notes.service";

@Injectable({
  providedIn: 'root'
})
export class AccountDeletionService {
  constructor(
    private auth: Auth,
    private onlineNotesService: OnlineNotesService,
  ) { }

  async deleteUserAccount() {
    await this.onlineNotesService.deleteUserNotesExceptFavourites()
    await deleteUser(this.auth.currentUser!)
  }

}
