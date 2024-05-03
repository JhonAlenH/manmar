import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerAutomobileComponent } from './container-automobile.component';

describe('ContainerAutomobileComponent', () => {
  let component: ContainerAutomobileComponent;
  let fixture: ComponentFixture<ContainerAutomobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerAutomobileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerAutomobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
