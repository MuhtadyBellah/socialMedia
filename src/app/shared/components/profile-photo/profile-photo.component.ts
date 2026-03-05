import { UserData } from './../../../core/auth/models/auth.interface';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-photo',
  imports: [],
  templateUrl: './profile-photo.component.html',
  styleUrl: './profile-photo.component.css',
})
export class ProfilePhotoComponent {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) photo!: string;
}
