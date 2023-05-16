import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FavouriteNotesService} from "./services/notes/favourite-notes.service";
import {AlertsService, ErrorMessage} from "./services/alerts/alerts.service";
import {NetworkService} from "./services/native-platform/network.service";
import {PlatformService} from "./services/native-platform/platform.service";
import {ViewWillLeave} from "@ionic/angular";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, ViewWillLeave {
  networkService?: NetworkService
  favouriteNotesService?: FavouriteNotesService
  alertsService?: AlertsService

  constructor(private platformService: PlatformService) {
    /*if (this.platformService.isNativePlatform())
      this.injectServices()*/
  }

  private injectServices() {
    this.networkService = inject(NetworkService)
    this.favouriteNotesService = inject(FavouriteNotesService)
    this.alertsService = inject(AlertsService)
  }

  async ngOnInit() {
    console.log('app ngOnInit')
    await this.networkService?.listenToNetworkChanges()
  }

  async ngOnDestroy() {
    console.log('app ngOnDestroy')
    await this.storeFavouriteNotesLocally()
    await this.networkService?.removeNetworkChangesListener()
  }

  ionViewWillLeave() {
    console.log('app ionViewWillLeave')
  }

  private async storeFavouriteNotesLocally() {
    try {
      if (!await this.platformService.canStoreFavouriteNotesLocally())
        return
      this.favouriteNotesService?.storeUserFavouriteNotes()
    } catch (e: any) {
      await this.alertsService?.showErrorAlert(ErrorMessage.ERROR_STORING_FAVOURITE_NOTES)
    }
  }
}
