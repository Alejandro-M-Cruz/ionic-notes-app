import { Injectable } from '@angular/core';

export enum ErrorMessage {
  EMAIL_ALREADY_IN_USE = 'The email address is already in use by another account',
  USER_NOT_FOUND = 'There is no user with this email',
  WRONG_PASSWORD = 'The password is incorrect',
  REQUIRES_RECENT_LOGIN = 'You must have logged in recently to delete your account, please log in again',
  UNKNOWN = 'An error occurred, please try again later'
}

@Injectable({
  providedIn: 'root'
})
export class ErrorsService {
  identifyError(error: any) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return ErrorMessage.EMAIL_ALREADY_IN_USE
      case 'auth/user-not-found':
        return ErrorMessage.USER_NOT_FOUND
      case 'auth/wrong-password':
        return ErrorMessage.WRONG_PASSWORD
      case 'auth/requires-recent-login':
        return ErrorMessage.REQUIRES_RECENT_LOGIN
      default:
        return ErrorMessage.UNKNOWN
    }
  }
}
