import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceDetalheComponent } from './proce-detalhe.component';

describe('ProceDetalheComponent', () => {
  let component: ProceDetalheComponent;
  let fixture: ComponentFixture<ProceDetalheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProceDetalheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
