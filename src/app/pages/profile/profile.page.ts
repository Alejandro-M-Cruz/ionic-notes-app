import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {User} from "../../model/user.model";
import {Observable, Subscription} from "rxjs";
import {AuthenticationService} from "../../services/user/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  user: User | null = null
  userSubscription?: Subscription

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userSubscription = this.userService.currentUser$.subscribe(user => {
      this.user = user
    })
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe()
  }

  async onSignOutButtonClicked() {
    try{
      await this.authenticationService.signOut()
      await this.router.navigate(['/home'])
    } catch (e: any) {
      console.error(e)
      alert(e.message)
    }
  }
}
