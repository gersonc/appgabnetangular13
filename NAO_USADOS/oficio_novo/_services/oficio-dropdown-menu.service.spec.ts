import { TestBed } from '@angular/core/testing';

import { OficioDropdownMenuService } from './oficio-dropdown-menu.service';

describe('OficioDropdownMenuService', () => {
  let service: OficioDropdownMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OficioDropdownMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
