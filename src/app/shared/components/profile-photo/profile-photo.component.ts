import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-profile-photo',
  imports: [],
  templateUrl: './profile-photo.component.html',
  styleUrl: './profile-photo.component.css',
})
export class ProfilePhotoComponent {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) photo!: string;
  @Output() closeViewer = new EventEmitter();
  onClose() {
    this.closeViewer.emit();
  }
}
