import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {User} from "../../model/user.model";
import {AuthenticationService} from "../../services/user/authentication.service";
import {Router} from "@angular/router";
import {ProfilePhotoService} from "../../services/user/profile-photo.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  private passwordValidators = [
    Validators.minLength(User.MIN_PASSWORD_LENGTH),
    Validators.maxLength(User.MAX_PASSWORD_LENGTH),
    Validators.required
  ]
  signUpForm = this.formBuilder.nonNullable.group({
    username: ['', [
      Validators.minLength(User.MIN_USERNAME_LENGTH),
      Validators.maxLength(User.MAX_USERNAME_LENGTH),
      Validators.required
    ]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', this.passwordValidators],
    passwordConfirmation: ['', this.passwordValidators],
    profilePhoto: new FormControl<File | null>(null)
  })
  profilePhotoUrl?: string

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private profilePhotoService: ProfilePhotoService
  ) { }

  ngOnInit() {
  }

  async navigateToHome() {
    await this.router.navigate(['/home'])
  }

  private async uploadProfilePhotoAndGetUrl() {
    const profilePhoto = this.signUpForm.controls.profilePhoto.value
    this.profilePhotoUrl = profilePhoto ?
      await this.profilePhotoService.uploadProfilePhoto(profilePhoto) :
      undefined
  }

  private async signUp() {
    const { email, password, username } = this.signUpForm.controls
    await this.authenticationService.createUser(
      email.value!,
      password.value!,
      username.value!,
      this.profilePhotoUrl
    )
  }

  async onSubmit() {
    try {
      await this.uploadProfilePhotoAndGetUrl()
      await this.signUp()
      await this.navigateToHome()
    } catch (e: any) {
      alert(e.message)
    }
  }
}
