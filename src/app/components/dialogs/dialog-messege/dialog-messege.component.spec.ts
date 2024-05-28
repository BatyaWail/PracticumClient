import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMessegeComponent } from './dialog-messege.component';

describe('DialogMessegeComponent', () => {
  let component: DialogMessegeComponent;
  let fixture: ComponentFixture<DialogMessegeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogMessegeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogMessegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
