import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarefaUsuarioComponent } from './tarefa-usuario.component';

describe('TarefaUsuarioComponent', () => {
  let component: TarefaUsuarioComponent;
  let fixture: ComponentFixture<TarefaUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarefaUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TarefaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
