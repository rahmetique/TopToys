import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToyCard } from './toy-card';

describe('ToyCard', () => {
  let component: ToyCard;
  let fixture: ComponentFixture<ToyCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToyCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ToyCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
