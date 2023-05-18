import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoteViewerPage } from './note-viewer.page';

const routes: Routes = [
  {
    path: '',
    component: NoteViewerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoteViewerPageRoutingModule {}
