import { TestBed } from '@angular/core/testing';

import { UserAPIServiceService } from './user-apiservice.service';

describe('UserAPIServiceService', () => {
  let service: UserAPIServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAPIServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
