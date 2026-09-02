import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  greska = '';
  showPassword = false;

  readonly gradoviSrbije: string[] = [
    'Beograd', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica',
    'Zrenjanin', 'Pančevo', 'Čačak', 'Kruševac', 'Kraljevo',
    'Novi Pazar', 'Smederevo', 'Leskovac', 'Valjevo', 'Vranje',
    'Šabac', 'Užice', 'Sombor', 'Požarevac', 'Pirot',
    'Zaječar', 'Kikinda', 'Sremska Mitrovica', 'Jagodina',
    'Vršac', 'Bor', 'Ruma', 'Bačka Palanka', 'Prokuplje', 'Inđija'
  ];

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  registrujSe(form: NgForm): void {
    this.greska = '';
    if (form.invalid) return;

    const formValue = form.value;
    try {
      const punAdresa = `${formValue.street}, ${formValue.city}`;
      this.authService.register({
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone,
        address: punAdresa,
        password: formValue.password,
        favoriteCategories: [],
        favoriteToys: []
      });
      this.router.navigate(['/profile']);
    } catch (error) {
      if (error instanceof Error) {
        this.greska = error.message;
      } else {
        this.greska = 'Došlo je do greške prilikom registracije.';
      }
    }
  }
}