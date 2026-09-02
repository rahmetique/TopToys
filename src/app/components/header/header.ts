import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { ReservationService } from '../../services/reservation';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private readonly reservationService = inject(ReservationService);
  private readonly authService = inject(AuthService);

  readonly korisnik = this.authService.currentUser;

  get brojRezervacija(): number {
    return this.reservationService.reservationCount();
  }
}