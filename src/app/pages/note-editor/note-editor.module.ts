import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoteEditorPageRoutingModule } from './note-editor-routing.module';

import { NoteEditorPage } from './note-editor.page';
import {ToolbarComponent} from "../../components/toolbar/toolbar.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoteEditorPageRoutingModule,
    ToolbarComponent,
    ReactiveFormsModule
  ],
  declarations: [NoteEditorPage]
})
export class NoteEditorPageModule {}
