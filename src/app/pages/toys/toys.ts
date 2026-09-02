import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { Toy } from '../../models/toy';
import { ToyService } from '../../services/toy/toy';
import { ToyCard } from '../../components/toy-card/toy-card';
import { ToyFilters, ToyFilterCriteria } from '../../components/toy-filters/toy-filters';

@Component({
  selector: 'app-toys',
  standalone: true,
  imports: [
    CommonModule,
    ToyCard,
    ToyFilters
  ],
  templateUrl: './toys.html',
  styleUrl: './toys.css'
})
export class Toys implements OnInit {
  private readonly toyService = inject(ToyService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  listaIgracaka: Toy[] = [];
  filtriraneIgracke: Toy[] = [];
  ucitavanje = true;
  greska = '';

  ngOnInit(): void {
    this.ucitajIgracke();
  }

  private ucitajIgracke(): void {
    this.ucitavanje = true;
    this.greska = '';

    this.toyService.getToys().subscribe({
      next: (igracke) => {
        this.listaIgracaka = igracke;
        this.filtriraneIgracke = igracke;
        this.ucitavanje = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.greska = 'Došlo je do greške prilikom učitavanja igračaka.';
        this.ucitavanje = false;
        this.cdr.markForCheck();
      }
    });
  }

  primeniFiltere(filteri: ToyFilterCriteria): void {
    this.filtriraneIgracke = this.listaIgracaka.filter(igracka => {
      // 1. Текстовый поиск
      if (filteri.search && filteri.search.trim() !== '') {
        const searchTerm = filteri.search.toLowerCase();
        const matchesName = igracka.name?.toLowerCase().includes(searchTerm);
        const matchesDescription = igracka.description?.toLowerCase().includes(searchTerm);

        if (!matchesName && !matchesDescription) {
          return false;
        }
      }

      // 2. Фильтр по типу
      if (filteri.typeId !== null && igracka.type?.typeId !== filteri.typeId) {
        return false;
      }

      // 3. Фильтр по возрастной группе
      if (filteri.ageGroupId !== null && igracka.ageGroup?.ageGroupId !== filteri.ageGroupId) {
        return false;
      }

      // 4. Фильтр по целевой группе (исправленный блок)
      // 4. Фильтр по целевой группе (исправленный блок)
      if (filteri.targetGroup && filteri.targetGroup.trim() !== '') {
        const selectedTarget = filteri.targetGroup.toLowerCase().trim();
        const toyTarget = (igracka.targetGroup || '').toLowerCase().trim();

      if (!toyTarget.includes(selectedTarget) && !selectedTarget.includes(toyTarget)) {
        return false;
        }
      }

      // 5. Минимальная цена
      if (filteri.minPrice !== null && filteri.minPrice !== undefined && igracka.price < filteri.minPrice) {
        return false;
      }

      // 6. Максимальная цена
      if (filteri.maxPrice !== null && filteri.maxPrice !== undefined && igracka.price > filteri.maxPrice) {
        return false;
      }

      return true;
    });

    this.cdr.markForCheck();
  }

  prikaziDetalje(toyId: number): void {
    this.router.navigate(['/toys', toyId]);
  }
}