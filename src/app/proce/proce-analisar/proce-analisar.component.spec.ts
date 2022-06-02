import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceAnalisarComponent } from './proce-analisar.component';

describe('ProceAnalisarComponent', () => {
  let component: ProceAnalisarComponent;
  let fixture: ComponentFixture<ProceAnalisarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProceAnalisarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceAnalisarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
