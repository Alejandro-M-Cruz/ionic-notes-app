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
  DeleteConfirmationComponent
} from "./notes-grid/delete-confirmation/delete-confirmation.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ToolbarComponent
  ],
  declarations: [HomePage, NotesGridComponent, NoteComponent, DeleteConfirmationComponent]
})
export class HomePageModule {}
