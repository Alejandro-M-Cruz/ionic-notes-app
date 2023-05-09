export interface User {
  uid: string
  email: string
  username: string
  photoUrl?: string | null
  creationTime: Date
  lastSignInTime: Date
}
