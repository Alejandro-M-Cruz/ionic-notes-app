import { Injectable } from '@angular/core';
import {Capacitor} from "@capacitor/core";

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  constructor() { }

  canUseFavourites(): boolean {
    console.log('is native: ', Capacitor.isNativePlatform())
    return Capacitor.isNativePlatform()
  }
}
