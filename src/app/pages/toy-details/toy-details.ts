import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Toy } from '../../models/toy';
import { Review } from '../../models/review';
import { ToyService } from '../../services/toy/toy';
import { ReservationService } from '../../services/reservation';
import { ReviewService } from '../../services/review/review';
import { AuthService } from '../../services/auth';
import { RatingService } from '../../services/rating';
import { StarRating } from '../../components/star-rating/star-rating';

@Component({
  selector: 'app-toy-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StarRating],
  templateUrl: './toy-details.html',
  styleUrl: './toy-details.css'
})
export class ToyDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toyService = inject(ToyService);
  private readonly reservationService = inject(ReservationService);
  private readonly reviewService = inject(ReviewService);
  private readonly authService = inject(AuthService);
  private readonly ratingService = inject(RatingService);
  private readonly cdr = inject(ChangeDetectorRef);

  igracka: Toy | null = null;
  recenzije: Review[] = [];

  ucitavanje = true;
  greska = '';

  mozeDaOceni = false;
  noviKomentar = '';

  ngOnInit(): void {
    this.ucitajIgracku();
  }

  get prosrecnaOcena(): number {
    return this.igracka ? this.ratingService.getAverageRating(this.igracka.toyId) : 0;
  }

  private ucitajIgracku(): void {
    const toyId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!toyId) {
      this.greska = 'Igračka nije pronađena.';
      this.ucitavanje = false;
      this.cdr.markForCheck();
      return;
    }

    this.toyService.getToyById(toyId).subscribe({
      next: (igracka) => {
        this.igracka = igracka;
        this.recenzije = this.reviewService.getReviewsForToy(toyId);

        const currentUser = this.authService.getCurrentUser();

        if (currentUser) {
          const sveRezervacije = this.reservationService.getReservationsByUser(currentUser.id);
          this.mozeDaOceni = sveRezervacije.some(
            r => r.toy.toyId === toyId && r.status === 'potvrdjeno'
          );
        } else {
          this.mozeDaOceni = false;
        }

        this.ucitavanje = false;
        this.cdr.markForCheck();
      },

      error: () => {
        this.greska = 'Došlo je do greške prilikom učitavanja igračke.';
        this.ucitavanje = false;
        this.cdr.markForCheck();
      }
    });
  }

  rezervisiIgracku(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.igracka) {
      return;
    }

    this.reservationService.addReservation(
      this.igracka,
      currentUser.id
    );

    alert(`Igračka "${this.igracka.name}" je uspešno rezervisana.`);
  }

  posaljiRecenziju(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.igracka || !this.noviKomentar.trim()) {
      alert('Molimo vas unesite komentar.');
      return;
    }

    const ocenaKorisnika = this.ratingService.getUserRating(this.igracka.toyId, currentUser.id) || 5;

    this.reviewService.addReview(
      this.igracka.toyId,
      currentUser.id,
      `${currentUser.firstName} ${currentUser.lastName}`,
      ocenaKorisnika,
      this.noviKomentar
    );

    this.recenzije = this.reviewService.getReviewsForToy(this.igracka.toyId);
    this.noviKomentar = '';

    this.cdr.markForCheck();
    alert('Hvala vam na recenziji!');
  }
}