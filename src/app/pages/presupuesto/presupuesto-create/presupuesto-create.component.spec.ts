import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresupuestoCreateComponent } from './presupuesto-create.component';

describe('PresupuestoCreateComponent', () => {
  let component: PresupuestoCreateComponent;
  let fixture: ComponentFixture<PresupuestoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresupuestoCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresupuestoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
