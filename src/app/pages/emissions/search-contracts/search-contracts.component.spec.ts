import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchContractsComponent } from './search-contracts.component';

describe('SearchContractsComponent', () => {
  let component: SearchContractsComponent;
  let fixture: ComponentFixture<SearchContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchContractsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
