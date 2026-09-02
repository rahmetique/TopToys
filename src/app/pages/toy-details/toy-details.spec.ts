import { ComponentFixture, TestBed } from '@angular/core/testing';


import { ToyDetails } from './toy-details';

describe('ToyDetails', () => {
  let component: ToyDetails;
  let fixture: ComponentFixture<ToyDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToyDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(ToyDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
