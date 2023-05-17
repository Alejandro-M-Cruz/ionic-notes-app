import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {NetworkService} from "./services/native-platform/network.service";
import {FavouriteNotesServiceInjectorService} from "./services/native-platform/favourite-notes-service-injector.service";
import {Capacitor} from "@capacitor/core";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  networkService?: NetworkService

  constructor(private notesSyncService: FavouriteNotesServiceInjectorService) {
    if (Capacitor.isNativePlatform())
      this.injectServices()
  }

  private injectServices() {
    this.networkService = inject(NetworkService)
    this.notesSyncService.injectFavouriteNotesServiceIntoNotesService()
  }

  async ngOnInit() {
    await this.networkService?.listenToNetworkChanges()
  }

  async ngOnDestroy() {
    await this.networkService?.removeNetworkChangesListener()
  }

}
