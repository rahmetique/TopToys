import { TestBed } from '@angular/core/testing';

import { ToyService } from './toy';

describe('ToyService', () => {
  let service: ToyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});