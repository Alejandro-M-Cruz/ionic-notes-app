import { Component } from '@angular/core';
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  currentUser$ = this.userService.currentUser$

  constructor(private userService: UserService) {}

}
