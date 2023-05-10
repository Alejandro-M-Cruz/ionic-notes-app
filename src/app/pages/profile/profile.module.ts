import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import {SignInPageModule} from "../sign-in/sign-in.module";
import {ToolbarComponent} from "../../components/toolbar/toolbar.component";

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      IonicModule,
      ProfilePageRoutingModule,
      SignInPageModule,
      ToolbarComponent
    ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
