import {Injectable, NgZone} from '@angular/core';
import {Network} from "@capacitor/network";
import {Router} from "@angular/router";
import {PluginListenerHandle} from "@capacitor/core";
import {ToastsService} from "../alerts/toasts.service";

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private networkListener?: PluginListenerHandle
  private previousConnectionStatus?: boolean

  constructor(private toastsService: ToastsService, private router: Router, private ngZone: NgZone) { }

  isConnected(): Promise<boolean> {
    return Network.getStatus().then(status => status.connected)
  }

  async listenToNetworkChanges() {
    this.networkListener = Network.addListener('networkStatusChange', status => {
      this.onConnectionChangeEventFired(status.connected)
    })
    if (!await this.isConnected())
      await this.onAppStartedWithNoConnection()
  }

  private onConnectionChangeEventFired(isConnected: boolean) {
    if (isConnected === this.previousConnectionStatus || this.previousConnectionStatus === undefined) {
      this.previousConnectionStatus = isConnected
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
    await this.router.navigate(['/no-connection'])
    await this.toastsService.showErrorToast('Connection lost')
  }

  private async onConnectionRestored() {
    await this.router.navigate(['/notes'])
    await this.toastsService.showSuccessToast('Connection restored')
  }

  removeNetworkChangesListener() {
    this.networkListener?.remove()
  }
}
