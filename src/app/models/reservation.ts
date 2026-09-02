import { Toy } from './toy';

export type ReservationStatus =
  | 'rezervisano'
  | 'potvrdjeno'
  | 'otkazano';

export interface Reservation {
  id: number;
  userId: number;
  toy: Toy;
  status: ReservationStatus;
  reservationDate: string;
  quantity: number;

  /*
   * Vizuelno sakrivanje potvrđene kupovine.
   *
   * Ovo NE menja status rezervacije.
   * Rezervacija i dalje ostaje "potvrdjeno".
   */
  sakriveno?: boolean;
}