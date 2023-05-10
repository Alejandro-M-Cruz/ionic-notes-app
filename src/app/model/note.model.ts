export enum NoteDisplayOptions {
  ALL = 'all',
  FAVOURITES = 'favourites'
}

export class Note {
  static readonly MAX_TITLE_LENGTH = 1000
  static readonly MAX_CONTENT_LENGTH = 100000
  id?: string
  localId?: number
  title!: string
  content?: string
  isFavourite!: boolean
  creationTimestamp!: Date
  lastUpdateTimestamp!: Date
  userId?: string
}
