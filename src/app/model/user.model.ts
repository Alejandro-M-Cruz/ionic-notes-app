export class User {
  static readonly MIN_USERNAME_LENGTH = 3
  static readonly MAX_USERNAME_LENGTH = 32
  static readonly MIN_PASSWORD_LENGTH = 8
  static readonly MAX_PASSWORD_LENGTH = 20
  uid!: string
  email!: string
  username!: string
  photoUrl?: string | null
  creationTimestamp!: Date
  lastSignInTimestamp!: Date
}
