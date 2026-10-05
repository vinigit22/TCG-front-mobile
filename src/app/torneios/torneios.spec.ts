import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Torneios } from './torneios';

describe('Torneios', () => {
  let component: Torneios;
  let fixture: ComponentFixture<Torneios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Torneios],
    }).compileComponents();

    fixture = TestBed.createComponent(Torneios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
