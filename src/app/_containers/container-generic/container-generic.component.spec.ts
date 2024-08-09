import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerGenericComponent } from './container-generic.component';

describe('ContainerGenericComponent', () => {
  let component: ContainerGenericComponent;
  let fixture: ComponentFixture<ContainerGenericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerGenericComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
