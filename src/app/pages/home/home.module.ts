import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {ToolbarComponent} from "../../components/toolbar/toolbar.component";
import {NotesGridComponent} from "./notes-grid/notes-grid.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ToolbarComponent
  ],
  declarations: [HomePage, NotesGridComponent]
})
export class HomePageModule {}
