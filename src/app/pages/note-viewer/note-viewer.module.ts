import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoteViewerPageRoutingModule } from './note-viewer-routing.module';

import { NoteViewerPage } from './note-viewer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoteViewerPageRoutingModule
  ],
  declarations: [NoteViewerPage]
})
export class NoteViewerPageModule {}
