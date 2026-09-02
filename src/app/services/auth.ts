import { Injectable, signal } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly usersKey = 'toy-store-users';
  private readonly currentUserKey = 'toy-store-current-user';

  private users: User[] = [];
  private nextUserId = 1;

  readonly currentUser = signal<User | null>(null);


  constructor() {
    this.ucitajKorisnike();
    this.ucitajTrenutnogKorisnika();
  }


  // ==================================================
  // UČITAVANJE SVIH KORISNIKA
  // ==================================================

  private ucitajKorisnike(): void {

    const sacuvaniKorisnici =
      localStorage.getItem(this.usersKey);

    if (!sacuvaniKorisnici) {
      this.users = [];
      return;
    }

    try {

      const korisnici = JSON.parse(
        sacuvaniKorisnici
      ) as User[];

      this.users = korisnici.map(korisnik => ({
        ...korisnik,

        favoriteCategories:
          Array.isArray(korisnik.favoriteCategories)
            ? korisnik.favoriteCategories
            : [],

        favoriteToys:
          Array.isArray(korisnik.favoriteToys)
            ? korisnik.favoriteToys
            : []
      }));


      if (this.users.length > 0) {

        this.nextUserId =
          Math.max(
            ...this.users.map(
              korisnik => korisnik.id
            )
          ) + 1;

      }

      this.sacuvajKorisnike();

    } catch {

      this.users = [];

    }
  }


  private sacuvajKorisnike(): void {

    localStorage.setItem(
      this.usersKey,
      JSON.stringify(this.users)
    );

  }


  // ==================================================
  // UČITAVANJE TRENUTNOG KORISNIKA
  // ==================================================

  private ucitajTrenutnogKorisnika(): void {

    const sacuvaniKorisnik =
      localStorage.getItem(
        this.currentUserKey
      );

    if (!sacuvaniKorisnik) {
      return;
    }


    try {

      const sacuvani =
        JSON.parse(sacuvaniKorisnik) as User;

      const korisnik =
        this.users.find(
          user => user.id === sacuvani.id
        );


      if (!korisnik) {

        localStorage.removeItem(
          this.currentUserKey
        );

        return;

      }


      this.currentUser.set({
        ...korisnik,

        favoriteCategories:
          korisnik.favoriteCategories ?? [],

        favoriteToys:
          korisnik.favoriteToys ?? []
      });


    } catch {

      localStorage.removeItem(
        this.currentUserKey
      );

    }
  }


  // ==================================================
  // REGISTRACIJA
  // ==================================================

  register(
    userData: Omit<User, 'id'>
  ): User {

    // Validacija Email-a
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Unesite ispravnu email adresu.');
    }

    // Validacija Srpskog telefona (+381 ili 06)
    const phoneRegex = /^(\+381|0)6[0-9]\s?[0-9]{3}\s?[0-9]{3,4}$/;
    if (!phoneRegex.test(userData.phone)) {
      throw new Error('Broj telefona mora biti važeći broj u Srbij (npr. +38161234567 ili 061234567).');
    }

    // Provera da li email već postoji
    const existingUser =
      this.users.find(
        user =>
          user.email.toLowerCase() ===
          userData.email.toLowerCase()
      );

    if (existingUser) {
      throw new Error(
        'Korisnik sa ovom email adresom već postoji.'
      );
    }


    const newUser: User = {

      id: this.nextUserId++,

      ...userData,

      favoriteCategories:
        userData.favoriteCategories ?? [],

      favoriteToys:
        userData.favoriteToys ?? []

    };


    this.users.push(newUser);

    this.sacuvajKorisnike();

    this.postaviTrenutnogKorisnika(
      newUser
    );


    return newUser;
  }


  // ==================================================
  // PRIJAVA
  // ==================================================

  login(
    email: string,
    password: string
  ): User {

    const user =
      this.users.find(
        item =>
          item.email.toLowerCase() ===
          email.toLowerCase() &&
          item.password === password
      );


    if (!user) {

      throw new Error(
        'Pogrešan email ili lozinka.'
      );

    }


    this.postaviTrenutnogKorisnika(user);

    return user;
  }


  // ==================================================
  // AŽURIRANJE LIČNIH PODATAKA
  // ==================================================

  updateUserData(
    podaci: Partial<
      Pick<
        User,
        'firstName' |
        'lastName' |
        'phone' |
        'address'
      >
    >
  ): void {

    const korisnik =
      this.currentUser();

    if (!korisnik) {
      return;
    }


    const azuriraniKorisnik: User = {

      ...korisnik,

      ...podaci,

      favoriteCategories:
        korisnik.favoriteCategories ?? [],

      favoriteToys:
        korisnik.favoriteToys ?? []

    };


    this.azurirajKorisnika(
      azuriraniKorisnik
    );
  }


  // ==================================================
  // OMILJENE KATEGORIJE
  // ==================================================

  updateFavoriteCategories(
    kategorije: number[]
  ): void {

    const korisnik =
      this.currentUser();

    if (!korisnik) {
      return;
    }


    const azuriraniKorisnik: User = {

      ...korisnik,

      favoriteCategories: [
        ...kategorije
      ],

      favoriteToys:
        korisnik.favoriteToys ?? []

    };


    this.azurirajKorisnika(
      azuriraniKorisnik
    );
  }


  // ==================================================
  // OMILJENE IGRAČKE
  // ==================================================

  updateFavoriteToys(
    igracke: number[]
  ): void {

    const korisnik =
      this.currentUser();

    if (!korisnik) {
      return;
    }


    const azuriraniKorisnik: User = {

      ...korisnik,

      favoriteCategories:
        korisnik.favoriteCategories ?? [],

      favoriteToys: [
        ...igracke
      ]

    };


    this.azurirajKorisnika(
      azuriraniKorisnik
    );
  }


  // ==================================================
  // ZAJEDNIČKO AŽURIRANJE
  // ==================================================

  private azurirajKorisnika(
    korisnik: User
  ): void {

    const index =
      this.users.findIndex(
        user => user.id === korisnik.id
      );


    if (index === -1) {
      return;
    }


    this.users[index] = {

      ...korisnik,

      favoriteCategories:
        korisnik.favoriteCategories ?? [],

      favoriteToys:
        korisnik.favoriteToys ?? []

    };


    this.sacuvajKorisnike();

    this.currentUser.set(
      this.users[index]
    );

    localStorage.setItem(
      this.currentUserKey,
      JSON.stringify({
        id: this.users[index].id
      })
    );
  }


  // ==================================================
  // TRENUTNI KORISNIK
  // ==================================================

  private postaviTrenutnogKorisnika(
    korisnik: User
  ): void {

    const korisnikSaPodacima: User = {

      ...korisnik,

      favoriteCategories:
        korisnik.favoriteCategories ?? [],

      favoriteToys:
        korisnik.favoriteToys ?? []

    };


    this.currentUser.set(
      korisnikSaPodacima
    );

    localStorage.setItem(
      this.currentUserKey,
      JSON.stringify({
        id: korisnikSaPodacima.id
      })
    );
  }


  // ==================================================
  // ODJAVA
  // ==================================================

  logout(): void {

    this.currentUser.set(null);

    localStorage.removeItem(
      this.currentUserKey
    );
  }


  isLoggedIn(): boolean {

    return this.currentUser() !== null;

  }


  getCurrentUser(): User | null {

    return this.currentUser();

  }

}