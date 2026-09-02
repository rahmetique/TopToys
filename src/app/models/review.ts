export interface Review {
  id: number;
  toyId: number;
  korisnikId: number;
  korisnik: string;
  ocena: number;
  komentar: string;
  datum: string;
}