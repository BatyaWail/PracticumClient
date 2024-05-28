import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import {  DialogData2 } from '../../employee/add-employee/add-employee.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-dialog-add-employee',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent,CommonModule],
  templateUrl: './error-dialog-add-employee.component.html',
  styleUrl: './error-dialog-add-employee.component.scss'
})
export class ErrorDialogAddEmployeeComponent {
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData2) {
    console.log(this.data);
  }
}
