import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {User} from "../../model/user.model";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {AuthService} from "../../services/user/auth.service";
import {Router} from "@angular/router";
import {AccountDeletionService} from "../../services/user/account-deletion.service";
import {NotesService} from "../../services/notes/notes.service";
import {ProfilePhotoService} from "../../services/user/profile-photo.service";
import {AlertsService} from "../../services/alerts/alerts.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  user$ = new BehaviorSubject<User | null>(null)
  private userSubscription?: Subscription
  userNotesQuantity$?: Observable<number>
  userFavouriteNotesQuantity$?: Observable<number>

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private notesService: NotesService,
    private alertsService: AlertsService,
    private accountDeletionService: AccountDeletionService,
    private profilePhotoService: ProfilePhotoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCurrentUser$()
    this.loadNotesQuantity()
  }

  private loadCurrentUser$() {
    this.userSubscription = this.userService.currentUser$.subscribe(this.user$)
  }

  private loadNotesQuantity() {
    this.userNotesQuantity$ = this.notesService.getUserNotesQuantity$()
    this.userFavouriteNotesQuantity$ = this.notesService.getUserNotesQuantity$(true)
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe()
  }

  async onSignOutButtonClicked() {
    try{
      await this.authService.signOut()
      await this.router.navigate(['/home'])
    } catch (e: any) {
      await this.alertsService.showErrorAlert(e.message)
    }
  }

  async onAccountDeletionConfirmationClosed(shouldDeleteAccount: boolean) {
    if (shouldDeleteAccount)
      await this.accountDeletionService.deleteUserAccount()
  }

  async onRemoveProfilePhotoButtonClicked() {
    await this.profilePhotoService.deleteUserProfilePhoto()
  }
}
