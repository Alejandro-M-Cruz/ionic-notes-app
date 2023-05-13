import { Injectable } from '@angular/core';
import {Auth, deleteUser} from "@angular/fire/auth";
import {NotesService} from "../notes/notes.service";
import {ErrorMessage} from "../errors.service";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AccountDeletionService {

  constructor(private auth: Auth, private notesService: NotesService, private authService: AuthService) { }

  async deleteUserAccount() {
    try {
      await this.notesService.deleteAllUserNotes()
      await deleteUser(this.auth.currentUser!)
    } catch (e: any) {
      console.error(e)
      e.message = this.getCorrespondingErrorMessage(e)
      if (e.message ===  ErrorMessage.REQUIRES_RECENT_LOGIN)
        await this.authService.signOut()
      throw e
    }
  }

  private getCorrespondingErrorMessage(e: any) {
    switch(e.code) {
      case 'auth/requires-recent-login':
        return ErrorMessage.REQUIRES_RECENT_LOGIN
      default:
        return ErrorMessage.UNKNOWN
    }
  }
}
