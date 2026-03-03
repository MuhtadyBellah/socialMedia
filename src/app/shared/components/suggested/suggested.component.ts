import { Component } from '@angular/core';

@Component({
  selector: 'app-suggested',
  imports: [],
  templateUrl: './suggested.component.html',
  styleUrl: './suggested.component.css',
})
export class SuggestedComponent {
  suggestedFriends = [
    {
      name: 'Nourhan',
      username: '@nourhan',
      followers: 29,
      mutual: 11,
      avatar: 'https://ui-avatars.com/api/?name=Nourhan&background=d97706&color=fff',
    },
    {
      name: 'Usama',
      username: '@usamaalidev',
      followers: 8,
      mutual: 8,
      avatar: 'https://ui-avatars.com/api/?name=Usama&background=0284c7&color=fff',
    },
    {
      name: 'mohamed',
      username: 'route user',
      followers: 12,
      mutual: 6,
      avatar: 'https://ui-avatars.com/api/?name=Mohamed&background=0f766e&color=fff',
    },
    {
      name: 'mohamed',
      username: 'route user',
      followers: 10,
      mutual: 5,
      avatar: 'https://ui-avatars.com/api/?name=Mohamed&background=0f766e&color=fff',
    },
  ];
}
