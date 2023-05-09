import { Injectable } from '@angular/core';
import {Auth, authState} from "@angular/fire/auth";
import {User} from "../model/user.model";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private auth: Auth) { }

  private firebaseUserToUser(firebaseUser: any): User | null {
    return firebaseUser ? {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      username: firebaseUser.displayName,
      photoUrl: firebaseUser.photoURL,
      creationTime: new Date(firebaseUser.metadata.creationTime),
      lastSignInTime: new Date(firebaseUser.metadata.lastSignInTime)
    } : null
  }

  get currentUser(): User | null {
    return this.firebaseUserToUser(this.auth.currentUser)
  }

  get currentUser$(): Observable<User | null> {
    return authState(this.auth).pipe(map(firebaseUser => this.firebaseUserToUser(firebaseUser)))
  }
}
