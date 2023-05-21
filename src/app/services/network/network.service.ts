import {Injectable, NgZone} from '@angular/core';
import {Network} from "@capacitor/network";
import {Router} from "@angular/router";
import {PluginListenerHandle} from "@capacitor/core";
import {ToastsService} from "../alerts/toasts.service";
import {Location} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private networkListener?: PluginListenerHandle
  private previousConnectionStatus?: boolean
  private routeWhereConnectionWasLost?: string

  constructor(
    private toastsService: ToastsService,
    private location: Location,
    private router: Router,
    private ngZone: NgZone
  ) { }

  isConnected(): Promise<boolean> {
    return Network.getStatus().then(status => status.connected)
  }

  async listenToNetworkChanges() {
    this.networkListener = Network.addListener('networkStatusChange', async status => {
      await this.onConnectionChangeEventFired(status.connected)
    })
    this.previousConnectionStatus = await this.isConnected()
    if (!this.previousConnectionStatus)
      await this.onAppStartedWithNoConnection()
  }

  private async onConnectionChangeEventFired(isConnected: boolean) {
    if (isConnected === this.previousConnectionStatus)
      return
    if (this.previousConnectionStatus === undefined) {
      this.previousConnectionStatus = isConnected
      if (!isConnected)
        await this.onAppStartedWithNoConnection()
      return
    }
    this.previousConnectionStatus = isConnected
    this.ngZone.run(() => {
      isConnected ? this.onConnectionRestored() : this.onConnectionLost()
    })
  }

  private async onAppStartedWithNoConnection() {
    await this.router.navigate(['/no-connection'])
  }

  private async onConnectionLost() {
    this.routeWhereConnectionWasLost = this.location.path()
    await this.router.navigate(['/no-connection'])
    await this.toastsService.showErrorToast('Connection lost')
  }

  private async onConnectionRestored() {
    await this.router.navigate([this.routeWhereConnectionWasLost ?? '/notes'])
    await this.toastsService.showSuccessToast('Connection restored')
  }

  removeNetworkChangesListener() {
    this.networkListener?.remove()
  }
}
