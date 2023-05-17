import { Injectable } from '@angular/core';
import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  constructor(private toastController: ToastController) { }

  async showSuccessToast(message: string, duration: number = 3000) {
    const toast = await this.toastController.create({
      message,
      duration,
      color: 'success',
      position: 'top',
      icon: 'wifi-outline',
      buttons: [{
        side: 'end',
        icon: 'close-outline',
        role: 'cancel'
      }]
    })
    await toast.present()
  }

  async showErrorToast(message: string, duration: number = 3000) {
    const toast = await this.toastController.create({
      message,
      duration,
      color: 'danger',
      position: 'top',
      icon: 'cloud-offline-outline',
      buttons: [{
        side: 'end',
        icon: 'close-outline',
        role: 'cancel'
      }]
    })
    await toast.present()
  }
}
