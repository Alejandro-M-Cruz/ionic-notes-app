export enum NotesSortingMethod {
  LAST_UPDATED_FIRST,
  LAST_UPDATED_LAST,
  DEFAULT = LAST_UPDATED_FIRST
}

export class Note {
  static readonly MAX_TITLE_LENGTH = 1000
  static readonly MAX_CONTENT_LENGTH = 100000
  id!: string
  title!: string
  content!: string
  isFavourite!: boolean
  creationTimestamp!: Date
  lastUpdateTimestamp!: Date
  userId!: string
}
