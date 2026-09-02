import { TestBed } from '@angular/core/testing'; // <-- Важно: /testing на конце
import { ReservationService } from './reservation';

describe('ReservationService', () => {
  let service: ReservationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});