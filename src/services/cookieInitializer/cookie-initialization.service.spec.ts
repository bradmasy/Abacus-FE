import { TestBed } from '@angular/core/testing';

import { CookieInitializationService } from './cookie-initialization.service';

describe('CookieInitializationService', () => {
  let service: CookieInitializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookieInitializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
