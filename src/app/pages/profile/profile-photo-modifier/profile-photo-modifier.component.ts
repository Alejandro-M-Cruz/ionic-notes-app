import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import {ProfilePhotoService} from "../../../services/user/profile-photo.service";
import {BehaviorSubject, map, Subscription} from "rxjs";

@Component({
  selector: 'app-profile-photo-modifier',
  templateUrl: './profile-photo-modifier.component.html',
  styleUrls: ['./profile-photo-modifier.component.scss'],
})
export class ProfilePhotoModifierComponent implements OnInit, OnDestroy {
  @Input() profilePhotoUrl: string | undefined | null
  profilePhotoFormControl = new FormControl<File | null>(null)
  profilePhotoFileChanged$ = new BehaviorSubject(false)
  private profilePhotoFileSubscription?: Subscription

  constructor(private profilePhotoService: ProfilePhotoService) { }

  ngOnInit() {
    this.subscribeToProfilePhotoFileChanges()
  }

  private subscribeToProfilePhotoFileChanges() {
    this.profilePhotoFileSubscription = this.profilePhotoFormControl.valueChanges
      .pipe(map(profilePhotoFile => !!profilePhotoFile))
      .subscribe(this.profilePhotoFileChanged$)
  }

  onCancelButtonClicked(profilePhotoForm: HTMLFormElement) {
    profilePhotoForm!.reset()
    this.profilePhotoFileChanged$.next(false)
    this.profilePhotoFormControl.setValue(null)
  }

  async onConfirmButtonClicked() {
    await this.profilePhotoService.uploadUserProfilePhoto(this.profilePhotoFormControl.value!)
    this.profilePhotoFileChanged$.next(false)
  }

  ngOnDestroy() {
    this.profilePhotoFileSubscription?.unsubscribe()
  }
}
