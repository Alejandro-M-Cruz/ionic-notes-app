import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import {SignInPageModule} from "../sign-in/sign-in.module";
import {ToolbarComponent} from "../../components/toolbar/toolbar.component";
import {
  ProfilePhotoInputComponent
} from "../../components/user-authentication/profile-photo-input/profile-photo-input.component";
import {ProfilePhotoModifierComponent} from "./profile-photo-modifier/profile-photo-modifier.component";
import {UsernameInputComponent} from "../../components/user-authentication/username-input/username-input.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProfilePageRoutingModule,
        SignInPageModule,
        ToolbarComponent,
        NgOptimizedImage,
        ProfilePhotoInputComponent,
        UsernameInputComponent
    ],
    declarations: [ProfilePage, ProfilePhotoModifierComponent]
})
export class ProfilePageModule {}
