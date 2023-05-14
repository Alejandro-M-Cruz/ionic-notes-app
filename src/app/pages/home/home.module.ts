import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {ToolbarComponent} from "../../components/toolbar/toolbar.component";
import {NoteComponent} from "./note/note.component";
import {
    NoteFavouriteButtonComponent
} from "../../components/notes/note-favourite-button/note-favourite-button.component";
import {NoteDeletionButtonComponent} from "../../components/notes/note-deletion-button/note-deletion-button.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ToolbarComponent,
    NoteFavouriteButtonComponent,
    NoteDeletionButtonComponent
  ],
  declarations: [HomePage, NoteComponent]
})
export class HomePageModule {}
