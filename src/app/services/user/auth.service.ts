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
    await signInWithEmailAndPassword(this.auth, email, password)
  }

  async signOut() {
    await signOut(this.auth)
  }

  async createUser(email: string, password: string, username: string) {
    await createUserWithEmailAndPassword(this.auth, email, password)
    await this.setUsername(username)
  }

  private async setUsername(username: string) {
    await updateProfile(this.auth.currentUser!, { displayName: username })
  }

}
