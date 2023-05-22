import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, ValidatorFn, Validators} from "@angular/forms";
import {
  USER_PASSWORD_MAX_LENGTH, USERNAME_MAX_LENGTH, USER_PASSWORD_MIN_LENGTH, USERNAME_MIN_LENGTH
} from "../../model/user.model";
import {AuthService} from "../../services/user/auth.service";
import {Router} from "@angular/router";
import {AlertsService} from "../../services/alerts/alerts.service";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage {
  private passwordsMatch: ValidatorFn = (form: AbstractControl) => {
    const { password, passwordConfirmation } = form.value
    const passwordConfirmationControl = form.get('passwordConfirmation')!
    if (password === passwordConfirmation) {
      let errors: any = {}
      for (let error in passwordConfirmationControl.errors) {
        if (error !== 'passwordsDoNotMatch')
          errors[error] = passwordConfirmationControl.errors[error]
      }
      passwordConfirmationControl.setErrors(Object.keys(errors).length ? errors : null)
      return null
    }
    passwordConfirmationControl.setErrors({ passwordsDoNotMatch: true })
    return { passwordsDoNotMatch: true }
  }
  private passwordValidators = [
    Validators.minLength(USER_PASSWORD_MIN_LENGTH),
    Validators.maxLength(USER_PASSWORD_MAX_LENGTH),
    Validators.required
  ]
  signUpForm = this.formBuilder.nonNullable.group({
    username: ['', [
      Validators.minLength(USERNAME_MIN_LENGTH),
      Validators.maxLength(USERNAME_MAX_LENGTH),
      Validators.required
    ]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', this.passwordValidators],
    passwordConfirmation: ['', this.passwordValidators],
    profilePhoto: new FormControl<File | null>(null)
  }, {validators: [this.passwordsMatch]})

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private alertsService: AlertsService
  ) { }

  private async signUp() {
    const { email, password, username } = this.signUpForm.value
    await this.authService.createUser(email!, password!, username!)
  }

  async onSubmit() {
    try {
      await this.signUp()
      await this.uploadUserProfilePhoto()
      await this.router.navigate(['/notes'])
    } catch (e: any) {
      await this.alertsService.showErrorAlert(e)
    }
  }

  private async uploadUserProfilePhoto() {
    const { profilePhoto } = this.signUpForm.value
    if (profilePhoto) {
      await this.userService.updateProfilePhoto(profilePhoto)
      location.reload()
    }
  }
}
