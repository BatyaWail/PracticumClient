import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
export interface DialogMessege {
  title: string;
  messege: string;
  icon: string;
  isCancelButon:boolean;
}
@Component({
  selector: 'app-dialog-messege',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent,MatDialogActions,MatFormFieldModule, 
    MatButton, MatIconModule, MatIcon, CommonModule, MatTooltipModule],
  templateUrl: './dialog-messege.component.html',
  styleUrl: './dialog-messege.component.scss'
})
export class DialogMessegeComponent {
  // dialogRef: any;
  // constructor(@Inject(MAT_DIALOG_DATA) public data: DialogMessege) {
  //   console.log(this.data);
  // }
  constructor(public dialogRef: MatDialogRef<DialogMessegeComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogMessege) {
    console.log("data",this.data)
  }
  // onClick(): void {
  //   this.dialogRef.close(false); // החזרת ערך false אם לא נבחר למחוק
  // }
  // onNoClick(): void {
  //   this.dialogRef.close();
  // }
  onNoClick(): void {
    this.dialogRef.close(false); // החזרת ערך false אם לא נבחר למחוק
  }
  
  onYesClick(): void {
    this.dialogRef.close(true); // החזרת ערך true אם נבחר למחוק
  }

}
