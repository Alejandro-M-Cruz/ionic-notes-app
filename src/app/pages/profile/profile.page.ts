import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {User} from "../../model/user.model";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {AuthService} from "../../services/user/auth.service";
import {Router} from "@angular/router";
import {AccountDeletionService} from "../../services/user/account-deletion.service";
import {OnlineNotesService} from "../../services/notes/online-notes.service";
import {ProfilePhotoService} from "../../services/user/profile-photo.service";
import {AlertsService} from "../../services/alerts/alerts.service";
import {NotesDisplayOption} from "../../model/note.model";

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
  private readonly accountDeletionConfirmationTitle = 'Deleting account'
  private readonly accountDeletionConfirmationMessage =
    'Are you sure you want to delete your account and all of your notes? THIS ACTION CANNOT BE UNDONE'
  private readonly profilePhotoRemovalConfirmationTitle = 'Removing profile photo'
  private readonly profilePhotoRemovalConfirmationMessage =
    'Are you sure you want to remove your profile photo?'

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private notesService: OnlineNotesService,
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
    this.userNotesQuantity$ = this.notesService.getUserNotesQuantity$(NotesDisplayOption.ALL)
    this.userFavouriteNotesQuantity$ = this.notesService.getUserNotesQuantity$(NotesDisplayOption.FAVOURITES)
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe()
  }

  async onSignOutButtonClicked() {
    try{
      await this.authService.signOut()
      await this.router.navigate(['/home'])
    } catch (e: any) {
      await this.alertsService.showErrorAlert(e)
    }
  }

  private async onAccountDeletionErrorAlertClosed() {
    await this.authService.signOut()
    await this.router.navigate(['/sign-in'])
  }

  private async onAccountDeletionConfirmationClosed(shouldDeleteAccount: boolean) {
    try {
      if (shouldDeleteAccount) {
        await this.accountDeletionService.deleteUserAccount()
        await this.router.navigate(['/home'])
      }
    } catch (e: any) {
      await this.alertsService.showErrorAlert(e, this.onAccountDeletionErrorAlertClosed.bind(this))
    }
  }

  async onDeleteAccountButtonClicked() {
    await this.alertsService.showDeleteConfirmationAlert(
      this.accountDeletionConfirmationTitle,
      this.accountDeletionConfirmationMessage,
      this.onAccountDeletionConfirmationClosed.bind(this)
    )
  }

  private async onProfilePhotoRemovalConfirmationClosed(shouldRemoveProfilePhoto: boolean) {
    try {
      if (shouldRemoveProfilePhoto)
        await this.profilePhotoService.deleteUserProfilePhoto()
    } catch (e: any) {
      await this.alertsService.showErrorAlert(e)
    }
  }

  async onProfilePhotoRemovalButtonClicked() {
    await this.alertsService.showDeleteConfirmationAlert(
      this.profilePhotoRemovalConfirmationTitle,
      this.profilePhotoRemovalConfirmationMessage,
      this.onProfilePhotoRemovalConfirmationClosed.bind(this)
    )
  }

}
