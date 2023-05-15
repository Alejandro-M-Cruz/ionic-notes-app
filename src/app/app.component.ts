import {Component, inject, OnDestroy} from '@angular/core';
import {FavouriteNotesService} from "./services/notes/favourite-notes.service";
import {Capacitor} from "@capacitor/core";
import {AlertsService, ErrorMessage} from "./services/alerts/alerts.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {

  constructor() {}

  async ngOnDestroy() {
    await this.storeFavouriteNotesLocallyIfIsNativePlatform()
  }

  private async storeFavouriteNotesLocallyIfIsNativePlatform() {
    try {
      if (!Capacitor.isNativePlatform() || !navigator.onLine)
        return
      await inject(FavouriteNotesService).storeUserFavouriteNotes()
    } catch (e: any) {
      await inject(AlertsService).showErrorAlert(ErrorMessage.ERROR_STORING_FAVOURITE_NOTES)
    }
  }
}
