import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignUpPageRoutingModule } from './sign-up-routing.module';

import { SignUpPage } from './sign-up.page';
import {UsernameInputComponent} from "../../components/user-authentication/username-input/username-input.component";
import {PasswordInputComponent} from "../../components/user-authentication/password-input/password-input.component";
import {EmailInputComponent} from "../../components/user-authentication/email-input/email-input.component";
import {
  ProfilePhotoInputComponent
} from "../../components/user-authentication/profile-photo-input/profile-photo-input.component";
import {SignInPageModule} from "../sign-in/sign-in.module";
import {ToolbarComponent} from "../../components/toolbar/toolbar.component";

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      IonicModule,
      SignUpPageRoutingModule,
      ReactiveFormsModule,
      SignInPageModule,
      EmailInputComponent,
      PasswordInputComponent,
      UsernameInputComponent,
      ProfilePhotoInputComponent,
      ToolbarComponent
    ],
  exports: [
  ],
  declarations: [SignUpPage]
})
export class SignUpPageModule {}
