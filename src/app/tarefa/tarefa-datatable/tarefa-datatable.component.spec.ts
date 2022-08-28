import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarefaDatatableComponent } from './tarefa-datatable.component';

describe('TarefaDatatableComponent', () => {
  let component: TarefaDatatableComponent;
  let fixture: ComponentFixture<TarefaDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarefaDatatableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TarefaDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
