import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {User} from "../../model/user.model";
import {Router} from "@angular/router";
import {AuthService} from "../../services/user/auth.service";
import {AlertsService} from "../../services/alerts/alerts.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  signInForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [
      Validators.minLength(User.MIN_PASSWORD_LENGTH),
      Validators.maxLength(User.MAX_PASSWORD_LENGTH),
      Validators.required
    ]]
  })

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertsService: AlertsService
  ) { }

  ngOnInit() {}

  async navigateToHome() {
    await this.router.navigate(['/home'])
  }

  private async signIn() {
    const { email, password } = this.signInForm.controls
    await this.authService.signIn(email.value!, password.value!)
  }

  async onSubmit() {
    try {
      await this.signIn()
      await this.navigateToHome()
    } catch (e: any) {
      await this.alertsService.showErrorAlert(e.message)
    }
  }

}
