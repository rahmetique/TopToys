import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Toys } from './pages/toys/toys';
import { ToyDetails } from './pages/toy-details/toy-details';
import { Cart } from './pages/cart/cart';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'toys',
    component: Toys
  },
  {
    path: 'toys/:id',
    component: ToyDetails
  },
  {
    path: 'cart',
    component: Cart,
    canActivate: [authGuard] // Защита корзины
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard] // Защита профиля
  },
  {
    path: '**',
    redirectTo: ''
  }
];