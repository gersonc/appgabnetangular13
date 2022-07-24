import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmendaDetalheComponent } from './emenda-detalhe.component';

describe('EmendaDetalheComponent', () => {
  let component: EmendaDetalheComponent;
  let fixture: ComponentFixture<EmendaDetalheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmendaDetalheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmendaDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
