import { AfterViewInit, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  ngAfterViewInit(): void {
    initFlowbite();
  }
  protected readonly title = signal('socialMedia');
}
