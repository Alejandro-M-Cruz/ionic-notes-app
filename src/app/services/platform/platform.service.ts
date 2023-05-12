import { Injectable } from '@angular/core';
import {Capacitor} from "@capacitor/core";

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  constructor() { }

  canUseFavourites(): boolean {
    return Capacitor.isNativePlatform()
  }
}
