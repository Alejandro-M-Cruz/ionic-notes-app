export enum NotesFilteringOption {
  ALL = 'all',
  FAVOURITES = 'favourites',
  EXCEPT_FAVOURITES = 'except_favourites',
  DEFAULT = ALL
}

export enum NotesSortingMethod {
  LAST_UPDATED_FIRST,
  LAST_UPDATED_LAST,
  DEFAULT = LAST_UPDATED_FIRST
}

export const NOTE_TITLE_MAX_LENGTH = 1000
export const NOTE_CONTENT_MAX_LENGTH = 10000

export interface Note {
  id: string
  title: string
  content: string
  isFavourite: boolean
  creationTimestamp: Date
  lastUpdateTimestamp: Date
  localStorageTimestamp?: Date
  userId: string
}

