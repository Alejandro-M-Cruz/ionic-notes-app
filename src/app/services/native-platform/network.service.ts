import { Injectable } from '@angular/core';
import {Network} from "@capacitor/network";
import {Router} from "@angular/router";
import {PluginListenerHandle} from "@capacitor/core";

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private networkListener?: PluginListenerHandle

  constructor(private router: Router) { }

  isConnected(): Promise<boolean> {
    return Network.getStatus().then(status => status.connected)
  }

  listenToNetworkChanges() {
    this.networkListener = Network.addListener('networkStatusChange', async status => {
      console.log(status)
      status.connected ? await this.onConnectionRestored() : await this.onConnectionLost()
    })
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
