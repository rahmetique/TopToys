import { DecimalPipe } from '@angular/common';
import { Component, input, output, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Toy } from '../../models/toy';
import { StarRating } from '../star-rating/star-rating';
import { RatingService } from '../../services/rating';

@Component({
  selector: 'app-toy-card',
  standalone: true,
  imports: [
    DecimalPipe,
    StarRating,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './toy-card.html',
  styleUrl: './toy-card.css'
})
export class ToyCard {
  private readonly ratingService = inject(RatingService);

  readonly toy = input.required<Toy>();
  readonly detailsClicked = output<number>();

  get averageRating(): number {
    return this.ratingService.getAverageRating(this.toy().toyId);
  }

  onDetailsClick(): void {
    this.detailsClicked.emit(this.toy().toyId);
  }
}