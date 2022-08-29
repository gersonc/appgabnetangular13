import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarefaUsuarioSituacaoComponent } from './tarefa-usuario-situacao.component';

describe('TarefaUsuarioSituacaoComponent', () => {
  let component: TarefaUsuarioSituacaoComponent;
  let fixture: ComponentFixture<TarefaUsuarioSituacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarefaUsuarioSituacaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TarefaUsuarioSituacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
