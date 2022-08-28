import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarefaAtualizarComponent } from './tarefa-atualizar.component';

describe('TarefaAtualizarComponent', () => {
  let component: TarefaAtualizarComponent;
  let fixture: ComponentFixture<TarefaAtualizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarefaAtualizarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TarefaAtualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
