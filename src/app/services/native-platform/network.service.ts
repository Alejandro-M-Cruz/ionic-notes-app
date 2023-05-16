import {Injectable, NgZone} from '@angular/core';
import {Network} from "@capacitor/network";
import {Router} from "@angular/router";
import {PluginListenerHandle} from "@capacitor/core";

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private networkListener?: PluginListenerHandle
  private previousConnectionStatus?: boolean

  constructor(private router: Router, private ngZone: NgZone) { }

  isConnected(): Promise<boolean> {
    return Network.getStatus().then(status => status.connected)
  }

  async listenToNetworkChanges() {
    this.networkListener = Network.addListener('networkStatusChange', async status => {
      if (status.connected === this.previousConnectionStatus)
        return
      this.ngZone.run(() => {
        status.connected ? this.onConnectionRestored() : this.onConnectionLost()
      })
    })
    if (!await this.isConnected())
      await this.onConnectionLost()
  }

  private async onConnectionLost() {
    await this.router.navigate(['/no-connection'])
  }

  private async onConnectionRestored() {
    await this.router.navigate(['/notes'])
  }

  removeNetworkChangesListener() {
    this.networkListener?.remove()
  }
}
