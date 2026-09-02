import { Injectable } from '@angular/core';

export interface UserRating {
  toyId: number;
  userId: number;
  rating: number;
}

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private readonly storageKey = 'toy-store-ratings';

  private getRatings(): UserRating[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveRatings(ratings: UserRating[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(ratings));
  }

  // Получить оценку конкретного пользователя
  getUserRating(toyId: number, userId: number): number {
    const ratings = this.getRatings();
    const found = ratings.find(r => r.toyId === toyId && r.userId === userId);
    return found ? found.rating : 0;
  }

  // Установить/обновить оценку пользователя
  setRating(toyId: number, userId: number, rating: number): void {
    const ratings = this.getRatings();
    const index = ratings.findIndex(r => r.toyId === toyId && r.userId === userId);
    if (index !== -1) {
      ratings[index].rating = rating;
    } else {
      ratings.push({ toyId, userId, rating });
    }
    this.saveRatings(ratings);
  }

  // Получить среднюю оценку игрушки от всех пользователей
  getAverageRating(toyId: number): number {
    const ratings = this.getRatings().filter(r => r.toyId === toyId);
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / ratings.length) * 2) / 2; // Округление до 0.5
  }
}