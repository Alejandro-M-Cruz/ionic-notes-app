import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoteEditorPageRoutingModule } from './note-editor-routing.module';

import { NoteEditorPage } from './note-editor.page';
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
    NoteEditorPageRoutingModule,
    ToolbarComponent,
    ReactiveFormsModule,
    NoteFavouriteButtonComponent,
    NoteDeletionButtonComponent
  ],
  declarations: [NoteEditorPage]
})
export class NoteEditorPageModule {}
