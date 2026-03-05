import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { UserData } from '../../core/auth/models/auth.interface';
import { ProfilePhotoComponent } from '../../shared/components/profile-photo/profile-photo.component';

@Component({
  selector: 'app-profile',
  imports: [ProfilePhotoComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  currentUser: UserData | null = null;
  isViewed = false;

  ngOnInit(): void {
    const storedData = localStorage.getItem(environment.userData);
    if (storedData) {
      try {
        this.currentUser = JSON.parse(storedData);
      } catch (error) {
        console.error('Error parsing user data', error);
        this.currentUser = null;
      }
    }
  }

  toggleView() {
    this.isViewed = !this.isViewed;
  }
}
