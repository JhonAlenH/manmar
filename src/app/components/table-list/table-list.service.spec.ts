import { TestBed } from '@angular/core/testing';

import { TableListService } from './table-list.service';

describe('TableListService', () => {
  let service: TableListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
