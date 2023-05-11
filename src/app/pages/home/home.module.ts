import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {ToolbarComponent} from "../../components/toolbar/toolbar.component";
import {NotesGridComponent} from "./notes-grid/notes-grid.component";
import {
  NotesWithFavouritesComponent
} from "./notes-with-favourites/notes-with-favourites.component";
import {NotesWithoutFavouritesComponent} from "./notes-without-favourites/notes-without-favourites.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ToolbarComponent
  ],
  declarations: [HomePage, NotesGridComponent, NotesWithFavouritesComponent, NotesWithoutFavouritesComponent]
})
export class HomePageModule {}
