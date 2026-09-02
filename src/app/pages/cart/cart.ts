import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reservation, ReservationStatus } from '../../models/reservation';
import { ReservationService } from '../../services/reservation';
import { AuthService } from '../../services/auth';
import { RatingService } from '../../services/rating';
import { ReviewService } from '../../services/review/review';
import { StarRating } from '../../components/star-rating/star-rating';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    StarRating
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  private readonly reservationService = inject(ReservationService);
  private readonly authService = inject(AuthService);
  private readonly ratingService = inject(RatingService);
  private readonly reviewService = inject(ReviewService);
  private readonly cdr = inject(ChangeDetectorRef);

  rezervacije: Reservation[] = [];
  ukupnaCena = 0;
  userId: number | null = null;

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userId = user ? user.id : null;
    this.ucitajRezervacije();
  }

  ucitajRezervacije(): void {
    if (!this.userId) {
      this.rezervacije = [];
      this.ukupnaCena = 0;
      this.cdr.markForCheck();
      return;
    }

    this.rezervacije = this.reservationService.getReservationsByUser(this.userId);

    this.ukupnaCena = this.rezervacije
      .filter(rezervacija => rezervacija.status === 'rezervisano')
      .reduce((sum, rezervacija) => sum + (rezervacija.toy.price * rezervacija.quantity), 0);

    this.rezervacije.sort((a, b) => {
      const redosled: Record<ReservationStatus, number> = {
        rezervisano: 0,
        potvrdjeno: 1,
        otkazano: 2
      };
      return redosled[a.status] - redosled[b.status];
    });

    this.cdr.markForCheck();
  }

  // Оценивание
  getOcenaIgracke(toyId: number): number {
    if (!this.userId) return 0;
    return this.ratingService.getUserRating(toyId, this.userId);
  }

  oceniIgracku(toyId: number, ocena: number): void {
    if (!this.userId) return;

    this.ratingService.setRating(toyId, this.userId, ocena);
    this.reviewService.updateRatingOnly(toyId, this.userId, ocena);

    this.cdr.markForCheck();
  }

  // Геттеры
  get aktivneRezervacije(): Reservation[] {
    return this.rezervacije.filter(r => r.status === 'rezervisano');
  }

  get potvrdjeneKupovine(): Reservation[] {
    return this.rezervacije.filter(r => r.status === 'potvrdjeno' && !r.sakriveno);
  }

  get otkazaneRezervacije(): Reservation[] {
    return this.rezervacije.filter(r => r.status === 'otkazano');
  }

  // Действия
  obrisiRezervaciju(reservationId: number): void {
    this.reservationService.removeReservation(reservationId);
    this.ucitajRezervacije();
  }

  promeniKolicinu(reservationId: number, quantity: number): void {
    if (quantity < 1) return;
    this.reservationService.updateQuantity(reservationId, quantity);
    this.ucitajRezervacije();
  }

  promeniStatus(reservationId: number, status: ReservationStatus): void {
    this.reservationService.updateStatus(reservationId, status);
    this.ucitajRezervacije();
  }

  potvrdiSve(): void {
    const aktivne = this.aktivneRezervacije;
    if (aktivne.length === 0) return;

    const potvrda = window.confirm('Da li želite da potvrdite sve rezervacije?');
    if (!potvrda) return;

    aktivne.forEach(rezervacija => {
      this.reservationService.updateStatus(rezervacija.id, 'potvrdjeno');
    });

    alert('Vaše rezervacije su uspešno potvrdjene!');
    this.ucitajRezervacije();
  }

  sakrijPotvrdjene(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    if (this.potvrdjeneKupovine.length === 0) return;

    const potvrda = window.confirm(
      'Da li želite da sakrijete sve potvrđene kupovine sa stranice korpe? Ova akcija neće obrisati kupovine niti promeniti njihov status.'
    );
    if (!potvrda) return;

    this.reservationService.sakrijPotvrdjene(user.id);
    this.ucitajRezervacije();
  }
}