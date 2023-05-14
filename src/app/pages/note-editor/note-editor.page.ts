import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NotesService} from "../../services/notes/notes.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Note} from "../../model/note.model";
import {ViewWillEnter, ViewWillLeave} from "@ionic/angular";

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.page.html',
  styleUrls: ['./note-editor.page.scss'],
})
export class NoteEditorPage implements ViewWillEnter, ViewWillLeave {
  noteId: string | null = null
  initialNote?: Note
  readonly titleMaxLength = Note.TITLE_MAX_LENGTH
  readonly contentMaxLength = Note.CONTENT_MAX_LENGTH
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
    this.getNoteIdFromRouteParams()
    await this.loadNoteFormInitialValue()
  }

  private getNoteIdFromRouteParams() {
    this.noteId = this.route.snapshot.paramMap.get('noteId')
  }

  private async loadNoteFormInitialValue() {
    if (this.noteId)
      this.noteForm.patchValue(this.initialNote = await this.notesService.getNoteById(this.noteId))
  }

  noteHasChanged(): boolean {
    const { title, content } = this.noteForm.value
    return this.initialNote?.title !== title || this.initialNote?.content !== content
  }

  async onCancelButtonClicked() {
    await this.router.navigate(['/home'])
  }

  private async createNote() {
    await this.notesService.addNote(this.noteForm.value as Note)
  }

  private async updateNote() {
    await this.notesService.updateNote(this.noteId!, this.noteForm.value as Note)
  }

  async onSubmit() {
    this.noteId ? await this.updateNote() : await this.createNote()
    await this.router.navigate(['/home'])
  }

  ionViewWillLeave() {
    this.initialNote = undefined
  }
}
