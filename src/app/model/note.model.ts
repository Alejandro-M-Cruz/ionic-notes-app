export const notesSortingMethods = [
  (a: Note, b: Note) => a.creationTimestamp.getTime() - b.creationTimestamp.getTime(),
  (a: Note, b: Note) => a.lastUpdateTimestamp.getTime() - b.lastUpdateTimestamp.getTime(),
  (a: Note, b: Note) => a.title?.localeCompare(b.title ?? '') ?? 0
]

export enum NotesSortingMethod {
  CREATION_TIMESTAMP = 0,
  LAST_UPDATE_TIMESTAMP = 1,
  TITLE = 2,
  DEFAULT = LAST_UPDATE_TIMESTAMP
}

export class Note {
  static readonly MAX_TITLE_LENGTH = 1000
  static readonly MAX_CONTENT_LENGTH = 100000
  id?: string
  title?: string
  content?: string
  creationTimestamp!: Date
  lastUpdateTimestamp!: Date
  userId?: string
}
