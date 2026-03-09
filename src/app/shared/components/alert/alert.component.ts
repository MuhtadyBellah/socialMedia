import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  @Input({ required: true }) type: 'info' | 'danger' | 'success' | 'warning' = 'danger';
  @Input() title?: string = '';
  @Input() message?: string = '';
  @Input() items?: string[] = [];

  public get alertClasses(): string {
    const baseClasses = 'flex p-4 mb-4 text-sm rounded-lg border';

    switch (this.type) {
      case 'danger':
        return `${baseClasses} text-red-800 bg-red-50 border-red-200`;
      case 'success':
        return `${baseClasses} text-green-800 bg-green-50 border-green-200`;
      case 'warning':
        return `${baseClasses} text-yellow-800 bg-yellow-50 border-yellow-200`;
      case 'info':
      default:
        return `${baseClasses} text-blue-800 bg-blue-50 border-blue-200`;
    }
  }
}
