import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Empresalogin } from './empresalogin';

describe('Empresalogin', () => {
  let component: Empresalogin;
  let fixture: ComponentFixture<Empresalogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Empresalogin],
    }).compileComponents();

    fixture = TestBed.createComponent(Empresalogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
