import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarefaHistoricoComponent } from './tarefa-historico.component';

describe('TarefaHistoricoComponent', () => {
  let component: TarefaHistoricoComponent;
  let fixture: ComponentFixture<TarefaHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarefaHistoricoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TarefaHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
