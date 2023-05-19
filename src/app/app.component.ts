import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {NetworkService} from "./services/network/network.service";
import {Capacitor} from "@capacitor/core";
import {NotesService} from "./services/notes/notes.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  networkService?: NetworkService

  constructor(private notesService: NotesService) {
    if (Capacitor.isNativePlatform())
      this.networkService = inject(NetworkService)
  }

  async ngOnInit() {
    await this.networkService?.listenToNetworkChanges()
    await this.notesService.storeFavouriteNotesLocallyWhenUserChanges()
  }

  async ngOnDestroy() {
    await this.networkService?.removeNetworkChangesListener()
  }

}
