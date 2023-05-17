import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoConnectionPageRoutingModule } from './no-connection-routing.module';

import { NoConnectionPage } from './no-connection.page';
import {NoteComponent} from "../../components/notes/note/note.component";
import {NotesGridComponent} from "../../components/notes/notes-grid/notes-grid.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NoConnectionPageRoutingModule,
        NoteComponent,
        NotesGridComponent
    ],
  declarations: [NoConnectionPage]
})
export class NoConnectionPageModule {}
