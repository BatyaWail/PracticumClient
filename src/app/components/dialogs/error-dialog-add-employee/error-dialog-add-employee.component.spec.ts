import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDialogAddEmployeeComponent } from './error-dialog-add-employee.component';

describe('ErrorDialogAddEmployeeComponent', () => {
  let component: ErrorDialogAddEmployeeComponent;
  let fixture: ComponentFixture<ErrorDialogAddEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorDialogAddEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErrorDialogAddEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
