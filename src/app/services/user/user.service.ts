import { Injectable } from '@angular/core';
import {Auth, authState, updateProfile} from "@angular/fire/auth";
import {User} from "../../model/user.model";
import {map, Observable} from "rxjs";
import {ProfilePhotoService} from "./profile-photo.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private auth: Auth, private profilePhotoService: ProfilePhotoService) { }

  private firebaseUserToUser(firebaseUser: any): User | null {
    return firebaseUser ? {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      username: firebaseUser.displayName,
      photoUrl: firebaseUser.photoURL,
      creationTimestamp: new Date(firebaseUser.metadata.creationTime),
      lastSignInTimestamp: new Date(firebaseUser.metadata.lastSignInTime)
    } : null
  }

  get currentUser(): User | null {
    return this.firebaseUserToUser(this.auth.currentUser)
  }

  get currentUser$(): Observable<User | null> {
    return authState(this.auth)
      .pipe(map(firebaseUser => this.firebaseUserToUser(firebaseUser)))
  }

  async updateProfilePhoto(profilePhoto: File) {
    const photoUrl = await this.profilePhotoService.uploadUserProfilePhoto(
      this.auth.currentUser!.uid,
      profilePhoto
    )
    await updateProfile(this.auth.currentUser!, { photoURL: photoUrl })
  }

  async removeProfilePhoto() {
    await updateProfile(this.auth.currentUser!, { photoURL: '' })
    await this.profilePhotoService.deleteUserProfilePhoto(this.auth.currentUser!.uid)
  }
}
