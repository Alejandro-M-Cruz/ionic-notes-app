export const USERNAME_MIN_LENGTH = 3
export const USERNAME_MAX_LENGTH = 32
export const USER_PASSWORD_MIN_LENGTH = 8
export const USER_PASSWORD_MAX_LENGTH = 20

export interface User {
  uid: string
  email: string
  username: string
  photoUrl: string | null
  creationTimestamp: Date
  lastSignInTimestamp: Date
}
