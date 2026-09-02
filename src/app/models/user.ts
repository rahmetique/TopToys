export interface User {
  id: number;

  firstName: string;
  lastName: string;

  email: string;
  phone: string;
  address: string;

  password: string;

  favoriteCategories: number[];
  favoriteToys: number[];
}