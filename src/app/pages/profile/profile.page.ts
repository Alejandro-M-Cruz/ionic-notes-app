import {Component, ViewChild} from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {User, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH} from "../../model/user.model";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {AuthService} from "../../services/user/auth.service";
import {Router} from "@angular/router";
import {AccountDeletionService} from "../../services/user/account-deletion.service";
import {NotesService} from "../../services/notes/notes.service";
import {AlertsService} from "../../services/alerts/alerts.service";
import {NotesFilteringOption} from "../../model/note.model";
import {IonModal, ViewDidEnter, ViewWillEnter, ViewWillLeave} from "@ionic/angular";
import {FormControl, Validators} from "@angular/forms";
import {ToastsService} from "../../services/alerts/toasts.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements ViewWillEnter, ViewWillLeave {
  user$ = new BehaviorSubject<User | null>(null)
  private userSubscription?: Subscription
  userNotesQuantity$?: Observable<number | undefined>
  userFavouriteNotesQuantity$?: Observable<number | undefined>
  @ViewChild('usernameEditor') usernameEditorModal!: IonModal
  usernameFormControl = new FormControl(this.user$.value?.username ?? '', {
    nonNullable: true,
    validators: [
      Validators.minLength(USERNAME_MIN_LENGTH),
      Validators.maxLength(USERNAME_MAX_LENGTH),
      Validators.required
    ]
  })
  private readonly accountDeletionConfirmationTitle = 'Deleting account'
  private readonly accountDeletionConfirmationMessage =
    'Are you sure you want to delete your account and all of your notes? THIS ACTION CANNOT BE UNDONE'
  private readonly profilePhotoRemovalConfirmationTitle = 'Removing profile photo'
  private readonly profilePhotoRemovalConfirmationMessage =
    'Are you sure you want to remove your profile photo?'

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private notesService: NotesService,
    private alertsService: AlertsService,
    private toastsService: ToastsService,
    private accountDeletionService: AccountDeletionService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.loadCurrentUser()
    this.loadNotesQuantity()
  }

  ionViewWillLeave() {
    this.destroySubscriptions()
  }

  private loadCurrentUser() {
    this.userSubscription = this.userService.currentUser$.subscribe(this.user$)
  }

  private loadNotesQuantity() {
    this.userNotesQuantity$ = this.notesService.getUserNotesQuantity$(NotesFilteringOption.ALL)
    this.userFavouriteNotesQuantity$ = this.notesService.getUserNotesQuantity$(NotesFilteringOption.FAVOURITES)
  }

  private destroySubscriptions() {
    this.userNotesQuantity$ = undefined
    this.userFavouriteNotesQuantity$ = undefined
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
      if (shouldDeleteAccount)
        await this.deleteAccount()
    } catch (e: any) {
      await this.alertsService.showErrorAlert(e, this.onAccountDeletionErrorAlertClosed.bind(this))
    }
  }

  private async deleteAccount() {
    await this.accountDeletionService.deleteUserAccount()
    await this.router.navigate(['/home'])
    await this.toastsService.showAccountDeletedToast()
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
      if (shouldRemoveProfilePhoto) {
        await this.userService.removeProfilePhoto()
        location.reload()
      }
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

  onUsernameEditorOpened() {
    this.usernameFormControl.setValue(this.user$.value?.username ?? '')
  }

  async onCancelUsernameEditionButtonClicked() {
    this.usernameFormControl.reset()
    await this.usernameEditorModal.dismiss()
  }

  async onConfirmUsernameEditionButtonClicked() {
    await this.userService.updateUsername(this.usernameFormControl.value)
    await this.usernameEditorModal.dismiss()
    location.reload()
  }
}
