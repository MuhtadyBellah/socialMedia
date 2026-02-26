import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, RouterLinkWithHref, NgClass],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent implements OnInit {
  isActive: boolean = true;
  constructor(private router: Router) {}

  ngOnInit() {
    if (this.router.url.includes('register')) {
      this.isActive = false;
    } else {
      this.isActive = true;
    }
  }
}
