import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-profile-photo',
  imports: [CommonModule],
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePhotoComponent {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) photo!: string;
  @Output() closeViewer = new EventEmitter();
  onClose() {
    this.closeViewer.emit();
  }
}
