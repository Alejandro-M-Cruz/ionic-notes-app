import { Injectable } from '@angular/core';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private auth: Auth) { }

  async signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password)
    } catch (error: any) {
      console.error(error)
      throw error
    }
  }

  async createUser(email: string, password: string, username: string, photoUrl: string) {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password)
      await updateProfile(this.auth.currentUser!, {
        displayName: username, photoURL: photoUrl
      })
    } catch (error: any) {
      console.error(error)
      throw error
    }
  }
}
