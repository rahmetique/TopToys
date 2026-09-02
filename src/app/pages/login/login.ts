import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  greska = '';
  hidePassword = true;

  prijaviSe(form: NgForm): void {
    this.greska = '';
    if (form.invalid) return;

    try {
      this.authService.login(form.value.email, form.value.password);
      this.router.navigate(['/profile']);
    } catch (error) {
      if (error instanceof Error) {
        this.greska = error.message;
      } else {
        this.greska = 'Došlo je do greške prilikom prijave.';
      }
    }
  }
}