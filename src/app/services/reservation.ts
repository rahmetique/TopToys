import {
  Injectable,
  signal,
  computed,
  inject
} from '@angular/core';

import {
  Reservation,
  ReservationStatus
} from '../models/reservation';

import { Toy } from '../models/toy';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private readonly authService = inject(AuthService);

  private readonly reservationsKey =
    'toy-store-reservations';

  private readonly reservations =
    signal<Reservation[]>([]);

  private nextId = 1;

  readonly allReservations =
    this.reservations.asReadonly();


  constructor() {
    this.ucitajRezervacije();
  }


  // ==================================================
  // UČITAVANJE REZERVACIJA
  // ==================================================

  private ucitajRezervacije(): void {

    const sacuvaneRezervacije =
      localStorage.getItem(this.reservationsKey);

    if (!sacuvaneRezervacije) {
      return;
    }


    try {

      const rezervacije =
        JSON.parse(
          sacuvaneRezervacije
        ) as Reservation[];


      /*
       * Stare rezervacije možda nemaju
       * svojstvo "sakriveno".
       *
       * Zato ga normalizujemo na false.
       */

      const normalizovaneRezervacije =
        rezervacije.map(rezervacija => ({
          ...rezervacija,
          sakriveno:
            rezervacija.sakriveno ?? false
        }));


      this.reservations.set(
        normalizovaneRezervacije
      );


      if (normalizovaneRezervacije.length > 0) {

        this.nextId =
          Math.max(
            ...normalizovaneRezervacije.map(
              rezervacija => rezervacija.id
            )
          ) + 1;

      }

    } catch {

      this.reservations.set([]);
      this.nextId = 1;

    }
  }


  // ==================================================
  // ČUVANJE REZERVACIJA
  // ==================================================

  private sacuvajRezervacije(): void {

    localStorage.setItem(
      this.reservationsKey,
      JSON.stringify(
        this.reservations()
      )
    );

  }


  // ==================================================
  // ID TRENUTNOG KORISNIKA
  // ==================================================

  private getTrenutniKorisnikId(): number | null {

    const korisnik =
      this.authService.getCurrentUser();

    return korisnik
      ? korisnik.id
      : null;

  }


  // ==================================================
  // BROJ AKTIVNIH REZERVACIJA
  // ==================================================

  readonly reservationCount = computed(() => {

    const korisnikId =
      this.getTrenutniKorisnikId();


    if (korisnikId === null) {
      return 0;
    }


    return this.reservations()

      .filter(
        reservation =>
          reservation.userId === korisnikId &&
          reservation.status === 'rezervisano'
      )

      .reduce(
        (total, reservation) =>
          total + reservation.quantity,
        0
      );

  });


  // ==================================================
  // UKUPNA CENA AKTIVNE KUPOVINE
  // ==================================================

  readonly totalPrice = computed(() => {

    const korisnikId =
      this.getTrenutniKorisnikId();


    if (korisnikId === null) {
      return 0;
    }


    /*
     * VAŽNO:
     *
     * U cenu ulaze SAMO aktivne rezervacije.
     *
     * potvrdjeno = već kupljeno
     * otkazano = otkazano
     *
     * Ni jedno od njih ne ulazi u novu kupovinu.
     */

    return this.reservations()

      .filter(
        reservation =>
          reservation.userId === korisnikId &&
          reservation.status === 'rezervisano'
      )

      .reduce(
        (total, reservation) =>
          total +
          reservation.toy.price *
          reservation.quantity,
        0
      );

  });


  // ==================================================
  // SVE REZERVACIJE
  // ==================================================

  getReservations(): Reservation[] {
    return this.reservations();
  }


  // ==================================================
  // REZERVACIJE KONKRETNOG KORISNIKA
  // ==================================================

  getReservationsByUser(
    userId: number
  ): Reservation[] {

    return this.reservations()
      .filter(
        reservation =>
          reservation.userId === userId
      );

  }


  // ==================================================
  // DODAVANJE IGRAČKE U KORPU
  // ==================================================

  addReservation(
    toy: Toy,
    userId: number,
    quantity: number = 1
  ): Reservation {

    const existingIndex =
      this.reservations().findIndex(
        item =>
          item.toy.toyId === toy.toyId &&
          item.userId === userId &&
          item.status === 'rezervisano'
      );


    /*
     * Ako je ista igračka već aktivno
     * rezervisana, povećavamo količinu.
     */

    if (existingIndex !== -1) {

      const existing =
        this.reservations()[existingIndex];


      this.updateQuantity(
        existing.id,
        existing.quantity + quantity
      );


      return {
        ...existing,
        quantity:
          existing.quantity + quantity
      };

    }


    /*
     * Nova aktivna rezervacija.
     */

    const newReservation: Reservation = {

      id: this.nextId++,

      userId,

      toy,

      status: 'rezervisano',

      reservationDate:
        new Date()
          .toISOString()
          .split('T')[0],

      quantity,

      sakriveno: false

    };


    this.reservations.update(
      list => [
        ...list,
        newReservation
      ]
    );


    this.sacuvajRezervacije();


    return newReservation;
  }


  // ==================================================
  // UKLANJANJE REZERVACIJE
  // ==================================================

  removeReservation(
    reservationId: number
  ): void {

    this.reservations.update(
      list =>
        list.filter(
          reservation =>
            reservation.id !== reservationId
        )
    );


    this.sacuvajRezervacije();

  }


  // ==================================================
  // PROMENA STATUSA
  // ==================================================

  updateStatus(
    reservationId: number,
    status: ReservationStatus
  ): void {

    this.reservations.update(
      list =>
        list.map(
          item => {

            if (item.id !== reservationId) {
              return item;
            }


            /*
             * Ako rezervaciju vraćamo u aktivno stanje,
             * ona ponovo mora biti vidljiva.
             */

            if (status === 'rezervisano') {

              return {
                ...item,
                status,
                sakriveno: false
              };

            }


            return {
              ...item,
              status
            };

          }
        )
    );


    this.sacuvajRezervacije();

  }


  // ==================================================
  // PROMENA KOLIČINE
  // ==================================================

  updateQuantity(
    reservationId: number,
    quantity: number
  ): void {

    if (quantity < 1) {
      return;
    }


    /*
     * Promena količine dozvoljena SAMO
     * za aktivne rezervacije.
     *
     * potvrdjeno nikada neće изменяться.
     */

    this.reservations.update(
      list =>
        list.map(
          item =>
            item.id === reservationId &&
            item.status === 'rezervisano'
              ? {
                  ...item,
                  quantity
                }
              : item
        )
    );


    this.sacuvajRezervacije();

  }


  // ==================================================
  // SAKRIVANJE POTVRĐENIH KUPOVINA
  // ==================================================

  sakrijPotvrdjene(
    userId: number
  ): void {

    this.reservations.update(
      list =>
        list.map(
          item => {

            if (
              item.userId !== userId ||
              item.status !== 'potvrdjeno'
            ) {
              return item;
            }


            /*
             * Status ostaje "potvrdjeno".
             * Menja se samo vizuelna vidljivost.
             */

            return {
              ...item,
              sakriveno: true
            };

          }
        )
    );


    this.sacuvajRezervacije();

  }


  // ==================================================
  // OPŠTA CENA
  // ==================================================

  getTotalPrice(): number {
    return this.totalPrice();
  }


  // ==================================================
  // BROJ REZERVACIJA
  // ==================================================

  getReservationCount(): number {
    return this.reservationCount();
  }

}