import { Injectable, inject } from '@angular/core';
import { Review } from '../../models/review';
import { RatingService } from '../rating';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly storageKey = 'toy-store-reviews';
  private readonly ratingService = inject(RatingService);

  private readonly initialReviews: Review[] = [
    {
      id: 1,
      toyId: 1,
      korisnikId: 101,
      korisnik: 'Ana Marko',
      ocena: 5,
      komentar: 'Sjajna igračka, odličan kvalitet!',
      datum: '2026-08-10'
    }
  ];

  private getStoredReviews(): Review[] {
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.initialReviews));
      return this.initialReviews;
    }
    return JSON.parse(data);
  }

  private saveReviews(reviews: Review[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(reviews));
  }

  getReviewsForToy(toyId: number): Review[] {
    return this.getStoredReviews().filter(review => review.toyId === toyId);
  }

  addReview(
    toyId: number,
    korisnikId: number,
    korisnik: string,
    ocena: number,
    komentar: string
  ): void {
    const reviews = this.getStoredReviews();
    const existingIndex = reviews.findIndex(
      r => r.toyId === toyId && r.korisnikId === korisnikId
    );

    if (existingIndex !== -1) {
      reviews[existingIndex] = {
        ...reviews[existingIndex],
        ocena,
        komentar,
        datum: new Date().toISOString()
      };
    } else {
      const maxId = reviews.reduce((max, r) => (r.id > max ? r.id : max), 0);
      const novaRecenzija: Review = {
        id: maxId + 1,
        toyId,
        korisnikId,
        korisnik,
        ocena,
        komentar,
        datum: new Date().toISOString()
      };
      reviews.push(novaRecenzija);
    }

    this.saveReviews(reviews);
    this.ratingService.setRating(toyId, korisnikId, ocena);
  }

  updateRatingOnly(toyId: number, korisnikId: number, ocena: number): void {
    const reviews = this.getStoredReviews();
    const review = reviews.find(r => r.toyId === toyId && r.korisnikId === korisnikId);

    if (review) {
      review.ocena = ocena;
      this.saveReviews(reviews);
    }
  }
}