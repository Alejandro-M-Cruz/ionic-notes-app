import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignInPageRoutingModule } from './sign-in-routing.module';

import { SignInPage } from './sign-in.page';
import {ToolbarComponent} from "../../components/toolbar/toolbar.component";
import {EmailInputComponent} from "../../components/user-authentication/email-input/email-input.component";
import {UsernameInputComponent} from "../../components/user-authentication/username-input/username-input.component";
import {PasswordInputComponent} from "../../components/user-authentication/password-input/password-input.component";
import {
  ProfilePhotoInputComponent
} from "../../components/user-authentication/profile-photo-input/profile-photo-input.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignInPageRoutingModule,
    ReactiveFormsModule,
    ToolbarComponent,
    EmailInputComponent,
    UsernameInputComponent,
    PasswordInputComponent,
    ProfilePhotoInputComponent
  ],
  exports: [
  ],
  declarations: [SignInPage]
})
export class SignInPageModule {}
