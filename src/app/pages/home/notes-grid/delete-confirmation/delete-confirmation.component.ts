import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss'],
})
export class DeleteConfirmationComponent implements OnInit {
  @Input() title!: string
  @Input() triggerButtonId!: string
  @Output() confirmationClosed = new EventEmitter<boolean>()

  constructor() { }

  ngOnInit() {}

  onDeleteAllNotesConfirmationClosed(event: any) {
    this.confirmationClosed.emit(event.detail.data?.action === 'delete')
  }
}
