import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-emojy',
  imports: [PickerModule, CommonModule],
  templateUrl: './emojy.component.html',
})
export class EmojyComponent implements OnDestroy {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Output() emojiSelected = new EventEmitter<string>();
  @ViewChild('container') container: ElementRef<HTMLElement> | undefined;

  private clickHandler: ((event: Event) => void) | null = null;

  ngOnDestroy(): void {
    this.removeClickListener();
  }

  onEmojiSelect(event: any): void {
    const emoji = event.emoji?.native || event.emoji;
    if (emoji && typeof emoji === 'string') {
      this.emojiSelected.emit(emoji);
    }
  }

  private removeClickListener(): void {
    if (this.clickHandler) {
      window.removeEventListener('click', this.clickHandler);
      this.clickHandler = null;
    }
  }
}
