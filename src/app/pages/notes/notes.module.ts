import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotesPageRoutingModule } from './notes-routing.module';

import { NotesPage } from './notes.page';
import {NoteComponent} from "./note/note.component";
import {ToolbarComponent} from "../../components/toolbar/toolbar.component";
import {
  NoteFavouriteButtonComponent
} from "../../components/notes/note-favourite-button/note-favourite-button.component";
import {NoteDeletionButtonComponent} from "../../components/notes/note-deletion-button/note-deletion-button.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotesPageRoutingModule,
    ToolbarComponent,
    NoteFavouriteButtonComponent,
    NoteDeletionButtonComponent
  ],
    declarations: [NotesPage, NoteComponent]
})
export class NotesPageModule {}
