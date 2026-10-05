import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jogos } from './jogos';

describe('Jogos', () => {
  let component: Jogos;
  let fixture: ComponentFixture<Jogos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jogos],
    }).compileComponents();

    fixture = TestBed.createComponent(Jogos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
