import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NotesService} from "../../services/notes/notes.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Note, NOTE_CONTENT_MAX_LENGTH, NOTE_TITLE_MAX_LENGTH} from "../../model/note.model";
import {ViewWillEnter, ViewWillLeave} from "@ionic/angular";
import {firstValueFrom, Subscription} from "rxjs";

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.page.html',
  styleUrls: ['./note-editor.page.scss'],
})
export class NoteEditorPage implements ViewWillEnter, ViewWillLeave {
  noteId: string | null = null
  isFavourite?: boolean
  note?: Note
  noteSubscription?: Subscription
  readonly titleMaxLength = NOTE_TITLE_MAX_LENGTH
  readonly contentMaxLength = NOTE_CONTENT_MAX_LENGTH
  noteForm = this.formBuilder.nonNullable.group({
    title: ['', Validators.maxLength(this.titleMaxLength)],
    content: ['', Validators.maxLength(this.contentMaxLength)]
  })

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private notesService: NotesService
  ) { }

  async ionViewWillEnter() {
    this.getRouteParams()
    if (this.noteId) {
      this.loadNoteBeingEdited()
      await this.loadNoteFormInitialValue()
    }
  }

  ionViewWillLeave() {
    this.destroyNoteSubscription()
  }

  private getRouteParams() {
    this.noteId = this.route.snapshot.paramMap.get('noteId')
    this.isFavourite = this.route.snapshot.paramMap.get('isFavourite') === 'true'
  }

  private loadNoteBeingEdited() {
    this.noteSubscription = this.notesService.getNoteById$(this.noteId!).subscribe(async note => {
      this.note = note
      if (!note)
        await this.onNoteDeleted()
    })
  }

  private async loadNoteFormInitialValue() {
    const initialFormValue = await firstValueFrom(this.notesService.getNoteById$(this.noteId!))
    this.noteForm.patchValue(initialFormValue!)
  }

  noteHasChanged(): boolean {
    const { title, content } = this.noteForm.value
    return this.note?.title !== title || this.note?.content !== content
  }

  async onCancelButtonClicked() {
    await this.router.navigate(['/notes'])
  }

  private async createNote() {
    await this.notesService.addNote({...this.noteForm.value, isFavourite: this.isFavourite} as Note)
  }

  private async updateNote() {
    await this.notesService.updateNote(this.noteId!, this.noteForm.value as Note)
  }

  async onSubmit() {
    this.noteId ? await this.updateNote() : await this.createNote()
    await this.router.navigate(['/notes'])
  }

  private destroyNoteSubscription() {
    this.note = undefined
    this.noteSubscription?.unsubscribe()
  }

  private async onNoteDeleted() {
    this.destroyNoteSubscription()
    await this.router.navigate(['/notes'])
  }

}
