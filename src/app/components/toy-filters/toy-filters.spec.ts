import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToyFilters } from './toy-filters';

describe('ToyFilters', () => {
  let component: ToyFilters;
  let fixture: ComponentFixture<ToyFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToyFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(ToyFilters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
