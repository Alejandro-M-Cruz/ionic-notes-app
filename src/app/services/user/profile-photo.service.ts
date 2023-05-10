import { Injectable } from '@angular/core';
import {getDownloadURL, ref, Storage, uploadBytes} from "@angular/fire/storage";
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
  async uploadProfilePhoto(profilePhoto: File): Promise<string> {
    const path = `${this.profilePhotosStorage}/${this.userService.currentUser!.uid}/${profilePhoto.name}`
    try {
      const uploadResult = await uploadBytes(ref(this.storage, path), profilePhoto)
      return getDownloadURL(uploadResult.ref)
    } catch (e: any) {
      console.error(e)
      throw e
    }
  }
}
