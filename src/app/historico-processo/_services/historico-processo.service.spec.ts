import { TestBed } from '@angular/core/testing';

import { HistoricoProcessoService } from './historico-processo.service';

describe('HistoricoProcessoService', () => {
  let service: HistoricoProcessoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricoProcessoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
