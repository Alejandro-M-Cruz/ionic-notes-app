import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut, updateProfile,
} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth) { }

  async signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password)
    } catch (e: any) {
      console.error(e)
      throw e
    }
  }

  async signOut() {
    try {
      await signOut(this.auth)
    } catch (e: any) {
      console.error(e)
      throw e
    }
  }

  async createUser(email: string, password: string, username: string) {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password)
      await this.setUserName(username)
    } catch (e: any) {
      console.error(e)
      throw e
    }
  }

  private async setUserName(username: string) {
    await updateProfile(this.auth.currentUser!, { displayName: username })
  }
}
