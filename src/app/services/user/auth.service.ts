import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut, updateProfile,
} from "@angular/fire/auth";
import {ErrorsService} from "../alerts/errors.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private errorsService: ErrorsService) { }

  async signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password)
    } catch (e: any) {
      console.error(e)
      throw new Error(this.errorsService.identifyFirebaseError(e))
    }
  }

  async signOut() {
    try {
      await signOut(this.auth)
    } catch (e: any) {
      console.error(e)
      throw new Error(this.errorsService.identifyFirebaseError(e))
    }
  }

  async createUser(email: string, password: string, username: string) {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password)
      await this.setUsername(username)
    } catch (e: any) {
      console.error(e)
      throw new Error(this.errorsService.identifyFirebaseError(e))
    }
  }

  private async setUsername(username: string) {
    await updateProfile(this.auth.currentUser!, { displayName: username })
  }

}
