import {inject, Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  query,
  updateDoc,
  where
} from "@angular/fire/firestore";
import {BehaviorSubject, first, firstValueFrom, map, Observable, Subscription} from "rxjs";
import {Note, NotesFilteringOption, NotesSortingMethod} from "../../model/note.model";
import {UserService} from "../user/user.service";
import {LocalNotesService} from "./local-notes.service";
import {Capacitor} from "@capacitor/core";
import {NetworkService} from "../network/network.service";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private notesCollection = collection(this.firestore, 'notes')
  private favouriteNotesService?: LocalNotesService
  private userNotes$ = new BehaviorSubject<Note[] | null>(null)
  private userNotesSubscription?: Subscription

  constructor(
    private firestore: Firestore,
    private userService: UserService,
    private networkService: NetworkService
  ) {
    if (Capacitor.isNativePlatform())
      this.favouriteNotesService = inject(LocalNotesService)
  }

  private firestoreDocDataToNote = (docData: any): Note => {
    return {
      ...docData,
      creationTimestamp: docData.creationTimestamp.toDate(),
      lastUpdateTimestamp: docData.lastUpdateTimestamp.toDate(),
    }
  }

  private getUserNotesFromFirestore$(userId: string): Observable<Note[]> {
    const q = query(this.notesCollection, where('userId', '==', userId))
    return collectionData(q, {idField: 'id'}).pipe(
      map(userNotes => userNotes.map(this.firestoreDocDataToNote))
    )
  }

  private loadUserNotes(userId: string) {
    this.userNotes$.next(null)
    this.userNotesSubscription?.unsubscribe()
    this.userNotesSubscription = this.getUserNotesFromFirestore$(userId).subscribe(this.userNotes$)
  }

  getNoteById$(noteId: string): Observable<Note | undefined> {
    return this.userNotes$.pipe(map(userNotes => userNotes?.find(note => note.id === noteId)))
  }

  getUserNotes$(filteringOption?: NotesFilteringOption, sortingMethod?: NotesSortingMethod) {
    return this.userNotes$.pipe(
      map(userNotes => userNotes?.filter(this.getFilteringFunction(filteringOption))),
      map(userNotes => userNotes?.sort(this.getSortingFunction(sortingMethod)))
    )
  }

  getUserNotesQuantity$(filteringOption?: NotesFilteringOption) {
    return this.getUserNotes$(filteringOption).pipe(map(userNotes => userNotes?.length))
  }

  private getFilteringFunction(filteringOption?: NotesFilteringOption): any {
    switch (filteringOption) {
      case NotesFilteringOption.ALL:
        return (_: Note) => true
      case NotesFilteringOption.FAVOURITES:
        return (note: Note) => note.isFavourite
      case NotesFilteringOption.EXCEPT_FAVOURITES:
        return (note: Note) => !note.isFavourite
      default:
        return this.getFilteringFunction(NotesFilteringOption.DEFAULT)
    }
  }

  private getSortingFunction(sortingMethod?: NotesSortingMethod): any {
    switch (sortingMethod) {
      case NotesSortingMethod.LAST_UPDATED_FIRST:
        return (note1: Note, note2: Note) =>
          note2.lastUpdateTimestamp.getTime() - note1.lastUpdateTimestamp.getTime()
      case NotesSortingMethod.LAST_UPDATED_LAST:
        return (note1: Note, note2: Note) =>
          note1.lastUpdateTimestamp.getTime() - note2.lastUpdateTimestamp.getTime()
      default:
        return this.getSortingFunction(NotesSortingMethod.DEFAULT)
    }
  }

  async addNote(note: Note) {
    const now = new Date()
    await addDoc(this.notesCollection, {
      title: note.title,
      content: note.content,
      isFavourite: note.isFavourite ?? false,
      creationTimestamp: now,
      lastUpdateTimestamp: now,
      userId: this.userService.currentUser!.uid
    })
    this.storeFavouriteNotesLocally()
  }

  async deleteNote(noteId: string) {
    await deleteDoc(doc(this.notesCollection, noteId))
    this.storeFavouriteNotesLocally()
  }

  async deleteUserNotes(filteringOption?: NotesFilteringOption) {
    const userNotesExceptFavourites = await firstValueFrom(this.getUserNotes$(filteringOption))
    for (const note of userNotesExceptFavourites!)
      await this.deleteNote(note.id!)
    filteringOption === NotesFilteringOption.ALL ?
      this.favouriteNotesService?.deleteAllStoredNotes() :
      this.storeFavouriteNotesLocally()
  }

  async updateNote(noteId: string, note: Note) {
    await updateDoc(doc(this.notesCollection, noteId), {
      ...note,
      lastUpdateTimestamp: new Date()
    })
    this.storeFavouriteNotesLocally()
  }

  async toggleNoteIsFavourite(note: Note) {
    await updateDoc(doc(this.notesCollection, note.id!), {
      isFavourite: !note.isFavourite
    })
    this.storeFavouriteNotesLocally()
  }

  private getFavouriteNotesWhenLengthIsGreaterThanZero$() {
    return this.getUserNotes$(NotesFilteringOption.FAVOURITES)
      .pipe(first(favouriteNotes => (favouriteNotes?.length ?? 0) > 0))
  }

  private storeFavouriteNotesLocally() {
    this.getFavouriteNotesWhenLengthIsGreaterThanZero$().subscribe(async favouriteNotes => {
      if (favouriteNotes)
        await this.favouriteNotesService?.storeNotes(favouriteNotes)
    })
  }

  storeFavouriteNotesLocallyWhenUserChanges() {
    this.userService.currentUser$.subscribe(async user => {
      if (!await this.networkService.isConnected())
        return
      if (user) {
        this.loadUserNotes(user.uid)
        this.storeFavouriteNotesLocally()
      } else {
        this.userNotesSubscription?.unsubscribe()
        await this.favouriteNotesService?.deleteAllStoredNotes()
      }
    })
  }
}
