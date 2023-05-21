import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {USER_PASSWORD_MAX_LENGTH, USER_PASSWORD_MIN_LENGTH} from "../../model/user.model";
import {Router} from "@angular/router";
import {AuthService} from "../../services/user/auth.service";
import {AlertsService} from "../../services/alerts/alerts.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage {
  signInForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [
      Validators.minLength(USER_PASSWORD_MIN_LENGTH),
      Validators.maxLength(USER_PASSWORD_MAX_LENGTH),
      Validators.required
    ]]
  })

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertsService: AlertsService
  ) { }

  private async signIn() {
    const { email, password } = this.signInForm.value
    await this.authService.signIn(email!, password!)
  }

  async onSubmit() {
    try {
      await this.signIn()
      await this.router.navigate(['/notes'])
    } catch (e: any) {
      await this.alertsService.showErrorAlert(e)
    }
  }

}
