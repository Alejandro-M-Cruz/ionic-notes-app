import { Injectable } from '@angular/core';
import {Capacitor} from "@capacitor/core";
import {NetworkService} from "./network.service";
import {UserService} from "../user/user.service";

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(private networkService: NetworkService, private userService: UserService) { }

  isNativePlatform(): boolean {
    return Capacitor.isNativePlatform()
  }

  async canStoreFavouriteNotesLocally(): Promise<boolean> {
    return this.isNativePlatform() && await this.networkService.isConnected() && !!this.userService.currentUser
  }
}
