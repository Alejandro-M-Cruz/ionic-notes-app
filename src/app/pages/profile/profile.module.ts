import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import {SignInPageModule} from "../sign-in/sign-in.module";
import {ToolbarComponent} from "../../components/toolbar/toolbar.component";
import {DeleteConfirmationComponent} from "../../components/delete-confirmation/delete-confirmation.component";
import {
  ProfilePhotoInputComponent
} from "../../components/user-authentication/profile-photo-input/profile-photo-input.component";
import {ProfilePhotoModifierComponent} from "./profile-photo-modifier/profile-photo-modifier.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    SignInPageModule,
    ToolbarComponent,
    DeleteConfirmationComponent,
    NgOptimizedImage,
    ProfilePhotoInputComponent
  ],
    declarations: [ProfilePage, ProfilePhotoModifierComponent]
})
export class ProfilePageModule {}
