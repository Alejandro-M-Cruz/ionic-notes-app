import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import {BehaviorSubject, map, Subscription} from "rxjs";
import {UserService} from "../../../services/user/user.service";

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

  constructor(private userService: UserService) { }

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
    await this.userService.updateProfilePhoto(this.profilePhotoFormControl.value!)
    location.reload()
    this.profilePhotoFileChanged$.next(false)
  }

  ngOnDestroy() {
    this.profilePhotoFileSubscription?.unsubscribe()
  }
}
