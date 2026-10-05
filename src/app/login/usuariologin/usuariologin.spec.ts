import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Usuariologin } from './usuariologin';

describe('Usuariologin', () => {
  let component: Usuariologin;
  let fixture: ComponentFixture<Usuariologin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Usuariologin],
    }).compileComponents();

    fixture = TestBed.createComponent(Usuariologin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
