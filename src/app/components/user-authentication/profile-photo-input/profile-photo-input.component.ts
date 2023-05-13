import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {ProfilePhotoService} from "../../../services/user/profile-photo.service";
import {IonicModule} from "@ionic/angular";
import {NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-profile-photo-input',
  templateUrl: './profile-photo-input.component.html',
  styleUrls: ['./profile-photo-input.component.scss'],
  imports: [IonicModule, NgIf, NgOptimizedImage],
  standalone: true
})
export class ProfilePhotoInputComponent implements OnInit, OnDestroy {
  @Input() control!: FormControl
  @Input() profilePhotoUrl: string | null | undefined
  profilePhotoFile: File | null = null
  notYetUploadedProfilePhotoUrl: string | null = null

  constructor(private profilePhotoService: ProfilePhotoService) { }

  ngOnInit() {
    this.control.valueChanges.subscribe(profilePhotoFile => this.onControlValueChanged(profilePhotoFile))
  }

  ngOnDestroy() {
    this.destroyNotYetUploadedProfilePhotoUrl()
  }

  private destroyNotYetUploadedProfilePhotoUrl() {
    if (this.notYetUploadedProfilePhotoUrl) {
      this.profilePhotoService.revokeNotYetUploadedProfilePhotoURl(this.notYetUploadedProfilePhotoUrl)
      this.notYetUploadedProfilePhotoUrl = null
    }
  }

  onControlValueChanged(profilePhotoFile: File | null) {
    if (profilePhotoFile === null)
      this.destroyNotYetUploadedProfilePhotoUrl()
  }

  onImageFileChanged(event: Event) {
    this.profilePhotoFile = (event.target as any).files[0] ?? null
    this.notYetUploadedProfilePhotoUrl = this.profilePhotoFile ?
      this.profilePhotoService.createNotYetUploadedProfilePhotoUrl(this.profilePhotoFile) :
      null
    this.control.setValue(this.profilePhotoFile)
  }
}
