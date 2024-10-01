import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRenovationComponent } from './detail-renovation.component';

describe('DetailRenovationComponent', () => {
  let component: DetailRenovationComponent;
  let fixture: ComponentFixture<DetailRenovationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailRenovationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailRenovationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
