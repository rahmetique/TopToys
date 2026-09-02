import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="star-rating" [class.readonly]="readonly">
      @for (star of [1, 2, 3, 4, 5]; track star) {
        <div class="star-wrapper">
          <!-- Левая половина звёздочки -->
          <span
            class="star half"
            [class.filled]="rating >= star - 0.5"
            (click)="onStarClick(star - 0.5)">
            ★
          </span>
          <!-- Правая половина звёздочки -->
          <span
            class="star full"
            [class.filled]="rating >= star"
            (click)="onStarClick(star)">
            ★
          </span>
        </div>
      }
    </div>
  `,
  styles: [`
    .star-rating {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      user-select: none;
    }
    .star-wrapper {
      position: relative;
      display: inline-block;
      width: 20px;
      height: 24px;
      font-size: 24px;
      line-height: 24px;
      cursor: pointer;
    }
    .readonly .star-wrapper {
      cursor: default;
    }
    .star {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      color: #e0e0e0; /* Серая бесцветная звезда по умолчанию */
      transition: color 0.15s ease;
      overflow: hidden;
    }
    .star.half {
      clip-path: inset(0 50% 0 0);
      z-index: 2;
    }
    .star.full {
      clip-path: inset(0 0 0 50%);
      z-index: 1;
    }
    .star.filled {
      color: #ffb400; /* Закрашенная звезда */
    }
  `]
})
export class StarRating {
  @Input() rating = 0;
  @Input() readonly = false;
  @Output() ratingChange = new EventEmitter<number>();

  onStarClick(value: number): void {
    if (!this.readonly) {
      this.rating = value;
      this.ratingChange.emit(value);
    }
  }
}