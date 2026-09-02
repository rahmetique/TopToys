import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Toy,
  AgeGroup,
  ToyType
} from '../../models/toy';

@Injectable({
  providedIn: 'root'
})
export class ToyService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://toy.pequla.com/api';

  getToys(): Observable<Toy[]> {
    return this.http.get<Toy[]>(`${this.apiUrl}/toy`);
  }

  getToyById(toyId: number): Observable<Toy> {
    return this.http.get<Toy>(`${this.apiUrl}/toy/${toyId}`);
  }

  getToyByPermalink(permalink: string): Observable<Toy> {
    return this.http.get<Toy>(
      `${this.apiUrl}/toy/permalink/${permalink}`
    );
  }

  getAgeGroups(): Observable<AgeGroup[]> {
    return this.http.get<AgeGroup[]>(
      `${this.apiUrl}/age-group`
    );
  }

  getTypes(): Observable<ToyType[]> {
    return this.http.get<ToyType[]>(
      `${this.apiUrl}/type`
    );
  }
}