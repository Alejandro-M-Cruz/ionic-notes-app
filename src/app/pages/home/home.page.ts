import { Component } from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {PlatformService} from "../../services/platform/platform.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  currentUser$ = this.userService.currentUser$
  canUseFavourites = this.platformService.canUseFavourites()

  constructor(private userService: UserService, private platformService: PlatformService) {}

}
