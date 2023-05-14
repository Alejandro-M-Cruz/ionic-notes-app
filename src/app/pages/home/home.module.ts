import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {ToolbarComponent} from "../../components/toolbar/toolbar.component";
import {NotesGridComponent} from "./notes-grid/notes-grid.component";
import {NoteComponent} from "./notes-grid/note/note.component";
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
  declarations: [HomePage, NotesGridComponent, NoteComponent]
})
export class HomePageModule {}
