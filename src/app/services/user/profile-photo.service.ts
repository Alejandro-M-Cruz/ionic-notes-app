import { Injectable } from '@angular/core';
import {deleteObject, getDownloadURL, ref, Storage, uploadBytes} from "@angular/fire/storage";
import {UserService} from "./user.service";
import {DomSanitizer} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class ProfilePhotoService {
  private profilePhotosStorage = 'profile_photos'

  constructor(private storage: Storage, private userService: UserService, private domSanitizer: DomSanitizer) { }

  createNotYetUploadedProfilePhotoUrl(profilePhotoFile: File): string {
    const url = URL.createObjectURL(profilePhotoFile)
    return this.domSanitizer.bypassSecurityTrustUrl(url) as string
  }

  revokeNotYetUploadedProfilePhotoURl(notYetUploadedProfilePhotoUrl: string) {
    URL.revokeObjectURL(notYetUploadedProfilePhotoUrl)
  }

  async uploadUserProfilePhoto(profilePhoto: File) {
    try {
      const path = `${this.profilePhotosStorage}/${this.userService.currentUser!.uid}`
      const uploadResult = await uploadBytes(ref(this.storage, path), profilePhoto)
      const profilePhotoUrl = await getDownloadURL(uploadResult.ref)
      await this.userService.updateProfilePhotoUrl(profilePhotoUrl)
    } catch (e: any) {
      console.error(e)
      throw e
    }
  }

  async deleteUserProfilePhoto() {
    try {
      const path = `${this.profilePhotosStorage}/${this.userService.currentUser!.uid}`
      await this.userService.removeUserProfilePhoto()
      await deleteObject(ref(this.storage, path))
    } catch (e: any) {
      console.error(e)
      throw e
    }
  }
}
