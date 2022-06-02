import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceDatatableComponent } from './proce-datatable.component';

describe('ProceDatatableComponent', () => {
  let component: ProceDatatableComponent;
  let fixture: ComponentFixture<ProceDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProceDatatableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
