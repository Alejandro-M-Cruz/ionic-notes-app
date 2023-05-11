import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "@angular/fire/auth";
import {SubscriptionsService} from "../subscriptions.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private auth: Auth, private subscriptionsService: SubscriptionsService) { }

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
      this.subscriptionsService.destroySubscriptions()
    } catch (e: any) {
      console.error(e)
      throw e
    }
  }

  async createUser(email: string, password: string, username: string, photoUrl?: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password)
      await updateProfile(userCredential.user, {
        displayName: username, photoURL: photoUrl
      })
    } catch (e: any) {
      console.error(e)
      throw e
    }
  }
}
