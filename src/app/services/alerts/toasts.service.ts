import { Injectable } from '@angular/core';
import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class ToastsService {
  private toastClosingButton: any = {
    side: 'end',
    icon: 'close-outline',
    role: 'cancel'
  }

  constructor(private toastController: ToastController) { }

  async showConnectionRestoredToast() {
    const connectionRestoredToast = await this.toastController.create({
      message: 'Connection restored',
      duration: 3000,
      color: 'success',
      position: 'top',
      icon: 'wifi-outline',
      buttons: [this.toastClosingButton]
    })
    await connectionRestoredToast.present()
  }

  async showConnectionLostToast() {
    const connectionLostToast = await this.toastController.create({
      message: 'Connection lost',
      duration: 3000,
      color: 'danger',
      position: 'top',
      icon: 'cloud-offline-outline',
      buttons: [this.toastClosingButton]
    })
    await connectionLostToast.present()
  }

  async showAccountDeletedToast() {
    const accountDeletedToast = await this.toastController.create({
      message: 'Your account has been deleted',
      duration: 5000,
      color: 'warning',
      position: 'bottom',
      icon: 'person-remove-outline',
      buttons: [this.toastClosingButton]
    })
    await accountDeletedToast.present()
  }
}
