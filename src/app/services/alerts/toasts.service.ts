import { Injectable } from '@angular/core';
import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  constructor(private toastController: ToastController) { }

  async showSuccessToast(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      color: 'success',
      position: 'top'
    })
    await toast.present()
  }
}
