import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresupuestoMantComponent } from './presupuesto-mant.component';

describe('PresupuestoMantComponent', () => {
  let component: PresupuestoMantComponent;
  let fixture: ComponentFixture<PresupuestoMantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresupuestoMantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresupuestoMantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
