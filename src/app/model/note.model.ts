export enum NotesSortingMethod {
  LAST_UPDATED_FIRST,
  LAST_UPDATED_LAST,
  DEFAULT = LAST_UPDATED_FIRST
}

export class Note {
  static readonly TITLE_MAX_LENGTH = 1000
  static readonly CONTENT_MAX_LENGTH = 10000
  id?: string
  localId?: string
  title!: string
  content!: string
  isFavourite!: boolean
  creationTimestamp!: Date
  lastUpdateTimestamp!: Date
  userId!: string
}
