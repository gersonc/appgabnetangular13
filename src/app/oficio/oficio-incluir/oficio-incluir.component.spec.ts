import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OficioIncluirComponent } from './oficio-incluir.component';

describe('OficioIncluirComponent', () => {
  let component: OficioIncluirComponent;
  let fixture: ComponentFixture<OficioIncluirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OficioIncluirComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OficioIncluirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
