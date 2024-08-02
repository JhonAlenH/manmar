import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailContractsComponent } from './detail-contracts.component';

describe('DetailContractsComponent', () => {
  let component: DetailContractsComponent;
  let fixture: ComponentFixture<DetailContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailContractsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
