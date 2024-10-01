import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenovationsComponent } from './renovations.component';

describe('RenovationsComponent', () => {
  let component: RenovationsComponent;
  let fixture: ComponentFixture<RenovationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenovationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
