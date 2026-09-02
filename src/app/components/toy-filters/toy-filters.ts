import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AgeGroup, ToyType } from '../../models/toy';
import { ToyService } from '../../services/toy/toy';

export interface ToyFilterCriteria {
  search: string;
  typeId: number | null;
  ageGroupId: number | null;
  targetGroup: string;
  minPrice: number | null;
  maxPrice: number | null;
}

@Component({
  selector: 'app-toy-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './toy-filters.html',
  styleUrl: './toy-filters.css'
})
export class ToyFilters implements OnInit {
  private readonly toyService = inject(ToyService);

  readonly filtersChanged = output<ToyFilterCriteria>();

  tipoviIgracaka: ToyType[] = [];
  starosneGrupe: AgeGroup[] = [];

  filteri: ToyFilterCriteria = {
    search: '',
    typeId: null,
    ageGroupId: null,
    targetGroup: '',
    minPrice: null,
    maxPrice: null
  };

  ngOnInit(): void {
    this.ucitajTipove();
    this.ucitajStarosneGrupe();
  }

  private ucitajTipove(): void {
    this.toyService.getTypes().subscribe({
      next: (tipovi) => (this.tipoviIgracaka = tipovi)
    });
  }

  private ucitajStarosneGrupe(): void {
    this.toyService.getAgeGroups().subscribe({
      next: (grupe) => (this.starosneGrupe = grupe)
    });
  }

  primeniFiltere(): void {
    this.filtersChanged.emit({ ...this.filteri });
  }

  obrisiFiltere(): void {
    this.filteri = {
      search: '',
      typeId: null,
      ageGroupId: null,
      targetGroup: '',
      minPrice: null,
      maxPrice: null
    };
    this.primeniFiltere();
  }
}