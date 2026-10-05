import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Preco } from './preco';

describe('Preco', () => {
  let component: Preco;
  let fixture: ComponentFixture<Preco>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Preco],
    }).compileComponents();

    fixture = TestBed.createComponent(Preco);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
