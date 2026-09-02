import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  signal,
  computed
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth';
import { ToyService } from '../../services/toy/toy';
import { Toy, ToyType } from '../../models/toy';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly toyService = inject(ToyService);
  private readonly router = inject(Router);

  readonly korisnik = this.authService.currentUser;

  // Сигналы для загружаемых списков
  readonly tipovi = signal<ToyType[]>([]);
  readonly igracke = signal<Toy[]>([]);

  // Вычисляемые сигналы для фильтрации избранных категорий и игрушек
  readonly omiljeneKategorije = computed(() => {
    const user = this.korisnik();
    if (!user) {
      return [];
    }
    const favoriteIds = user.favoriteCategories ?? [];
    return this.tipovi().filter(tip => favoriteIds.includes(tip.typeId));
  });

  readonly omiljeneIgracke = computed(() => {
    const user = this.korisnik();
    if (!user) {
      return [];
    }
    const favoriteIds = user.favoriteToys ?? [];
    return this.igracke().filter(igracka => favoriteIds.includes(igracka.toyId));
  });

  // Режим редактирования профиля
  izmenaPodataka = false;

  // Режим редактирования избранного
  izmenaPodesavanja = false;

  // Временные данные профиля
  podaciForme = {
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  };

  // Временные выбранные категории
  izabraneKategorije: number[] = [];

  // Временные выбранные игрушки
  izabraneIgracke: number[] = [];

  ngOnInit(): void {
    this.ucitajTipove();
    this.ucitajIgracke();
  }

  // ==================================================
  // UČITAVANJE PODATAKA
  // ==================================================

  private ucitajTipove(): void {
    this.toyService
      .getTypes()
      .subscribe({
        next: tipovi => this.tipovi.set(tipovi)
      });
  }

  private ucitajIgracke(): void {
    this.toyService
      .getToys()
      .subscribe({
        next: igracke => this.igracke.set(igracke)
      });
  }

  // ==================================================
  // LIČNI PODACI
  // ==================================================

  otvoriIzmenuPodataka(): void {
    const user = this.korisnik();

    if (!user) {
      return;
    }

    this.podaciForme = {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address
    };

    this.izmenaPodataka = true;
  }

  sacuvajPodatke(): void {
    this.authService.updateUserData({
      firstName: this.podaciForme.firstName.trim(),
      lastName: this.podaciForme.lastName.trim(),
      phone: this.podaciForme.phone.trim(),
      address: this.podaciForme.address.trim()
    });

    this.izmenaPodataka = false;
  }

  otkaziIzmenuPodataka(): void {
    this.izmenaPodataka = false;
  }

  // ==================================================
  // OMILJENE KATEGORIJE
  // ==================================================

  otvoriPodesavanja(): void {
    const user = this.korisnik();

    if (!user) {
      return;
    }

    this.izabraneKategorije = [
      ...(user.favoriteCategories ?? [])
    ];

    this.izabraneIgracke = [
      ...(user.favoriteToys ?? [])
    ];

    this.izmenaPodesavanja = true;
  }

  jeIzabranaKategorija(typeId: number): boolean {
    return this.izabraneKategorije.includes(typeId);
  }

  promeniKategoriju(typeId: number): void {
    if (this.izabraneKategorije.includes(typeId)) {
      this.izabraneKategorije = this.izabraneKategorije.filter(id => id !== typeId);
    } else {
      this.izabraneKategorije = [...this.izabraneKategorije, typeId];
    }
  }

  // ==================================================
  // OMILJENE IGRAČKE
  // ==================================================

  jeIzabranaIgracka(toyId: number): boolean {
    return this.izabraneIgracke.includes(toyId);
  }

  promeniIgracku(toyId: number): void {
    if (this.izabraneIgracke.includes(toyId)) {
      this.izabraneIgracke = this.izabraneIgracke.filter(id => id !== toyId);
    } else {
      this.izabraneIgracke = [...this.izabraneIgracke, toyId];
    }
  }

  // ==================================================
  // ČUVANJE PODEŠAVANJA
  // ==================================================

  sacuvajPodesavanja(): void {
    this.authService.updateFavoriteCategories(this.izabraneKategorije);
    this.authService.updateFavoriteToys(this.izabraneIgracke);

    this.izmenaPodesavanja = false;
  }

  otkaziPodesavanja(): void {
    this.izmenaPodesavanja = false;
  }

  // ==================================================
  // ODJAVA
  // ==================================================

  odjaviSe(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}