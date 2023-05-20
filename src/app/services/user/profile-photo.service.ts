import { Injectable } from '@angular/core';
import {deleteObject, getDownloadURL, ref, Storage, uploadBytes} from "@angular/fire/storage";
import {DomSanitizer} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class ProfilePhotoService {
  private profilePhotosStorage = 'profile_photos'

  constructor(private storage: Storage, private domSanitizer: DomSanitizer) { }

  createNotYetUploadedProfilePhotoUrl(profilePhotoFile: File): string {
    const url = URL.createObjectURL(profilePhotoFile)
    return this.domSanitizer.bypassSecurityTrustUrl(url) as string
  }

  revokeNotYetUploadedProfilePhotoURl(notYetUploadedProfilePhotoUrl: string) {
    URL.revokeObjectURL(notYetUploadedProfilePhotoUrl)
  }

  async uploadUserProfilePhoto(uid: string, profilePhoto: File) {
    const path = `${this.profilePhotosStorage}/${uid}`
    const uploadResult = await uploadBytes(ref(this.storage, path), profilePhoto)
    return getDownloadURL(uploadResult.ref)
  }

  async deleteUserProfilePhoto(uid: string) {
    const path = `${this.profilePhotosStorage}/${uid}`
    await deleteObject(ref(this.storage, path))
  }
}
