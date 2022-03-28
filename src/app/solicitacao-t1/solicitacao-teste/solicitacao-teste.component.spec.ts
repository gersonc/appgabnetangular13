import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacaoTesteComponent } from './solicitacao-teste.component';

describe('SolicitacaoTesteComponent', () => {
  let component: SolicitacaoTesteComponent;
  let fixture: ComponentFixture<SolicitacaoTesteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitacaoTesteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitacaoTesteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
