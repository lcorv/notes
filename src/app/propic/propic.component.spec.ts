import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropicComponent } from './propic.component';

describe('PropicComponent', () => {
  let component: PropicComponent;
  let fixture: ComponentFixture<PropicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
