import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AbstractControl, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatCard, MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import form-related modules
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../../entities/employee.entites';
import { Role } from '../../../entities/role.entites';
import { EmployeeRolePostModel } from '../../../entities/employeeRole.postModel';
import { EmployeeService } from '../../../services/employee/employee.service';
import { ErrorDialogAddEmployeeComponent } from '../../dialogs/error-dialog-add-employee/error-dialog-add-employee.component';
import { DialogMessegeComponent } from '../../dialogs/dialog-messege/dialog-messege.component';
import { RoleService } from '../../../services/role/role.service';
@Component({
  selector: 'app-edit-employee-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],

  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule, ReactiveFormsModule, MatSlideToggleModule, MatCardModule, MatButtonModule, MatTooltipModule
  ],
  templateUrl: './edit-employee-dialog.component.html',
  styleUrl: './edit-employee-dialog.component.scss'
})
export class EditEmployeeDialogComponent implements OnInit {
  dateOfBirth: Date = new Date();
  isRolesListEmpty: boolean = false;

  onNoClick(): void {
    this.dialogRef.close();
  }
  public employeeForm!: FormGroup; // Define FormGroup
  public employee: Employee = new Employee()
  public rolesList!: Role[]
  public newRoleList!: Role[]
  employeeRoles: { roleName: string, isManagementRole: boolean, entryDate: Date | null }[] = [{ roleName: '', isManagementRole: false, entryDate: null }];
  employeeRoleResult: EmployeeRolePostModel[] = []
  employeeToUpdate: Employee = new Employee()

  @ViewChildren(MatDatepicker)
  entryDatePickers!: QueryList<MatDatepicker<any>>;
  employeeRolePostModel: EmployeeRolePostModel = new EmployeeRolePostModel()
  validationErrors: string[] = []; // Array to store validation errors
  employeeId: any;
  constructor(
    private _employeeService: EmployeeService,
    private _roleServices: RoleService,
    private fb: FormBuilder // Inject FormBuilder
    , public dialog: MatDialog,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<EditEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employee,
    private router: Router

  ) { }

  ngOnInit(): void {
    this._roleServices.getAllRoles().subscribe({
      next: (res) => {
        this.rolesList = res;
      },
      error: (error) => {
        console.error(error);
        // Handle error appropriately
      }
    });
    this.initializeForm();

  }
  initializeForm() {
    this.employeeForm = this.fb.group({
      identity: [this.data.identity, [Validators.required, Validators.minLength(9), Validators.maxLength(9), this.identityFormatValidator]],
      firstName: [this.data.firstName, Validators.required],
      lastName: [this.data.lastName, Validators.required],
      maleOrFmale: [this.data.maleOrFmale ? "0" : "1", Validators.required],
      dateOfBirth: [this.data.dateOfBirth, [Validators.required, this.dateOfBirthValidator.bind(this)]],
      startDate: [this.data.startDate, [Validators.required, this.startDateValidator.bind(this)]],
      employeeRoles: this.fb.array(this.initializeRoles())
    });
    // this.filterRoles()
  }
  initializeRoles(): FormGroup[] {
    return this.data.employeeRoles.map(role => {
      return this.fb.group({
        roleId: [role.roleId, Validators.required],
        isManagementRole: [role.isManagementRole, Validators.required], // Assuming isManagementRole is a boolean
        entryDate: [role.entryDate, Validators.required]
      });
    });
  }

  get employeeRolesFormArray() {
    return this.employeeForm.get('employeeRoles') as FormArray;
  }


  addRole() {
    const roleFormGroup = this.fb.group({
      roleId: ['', Validators.required],
      isManagementRole: [false, Validators.required], // Assuming isManagementRole is a boolean
      entryDate: [null, Validators.required]
    });
    this.employeeRolesFormArray.push(roleFormGroup);
  }
  removeRole(index: number) {
    this.employeeRolesFormArray.removeAt(index);
  }
  submit() {
    if (!this.submitForm()) {
      this.dialog.open(ErrorDialogAddEmployeeComponent, {
        data: {
          errors: this.validationErrors,
        },
      });
      console.log("Validation errors:", this.validationErrors);
    }

    // this.onNoClick();

  }
  updateEmployee(): void {
    if (this.employeeForm.valid) {
      const updatedEmployee: Employee = this.employeeForm.value;
      // Perform any necessary formatting or adjustments to the data before sending it to the service
      this._employeeService.updateEmployee(updatedEmployee).subscribe({
        next: (res) => {
          // Handle success response
          const dialogRef = this.dialog.open(DialogMessegeComponent, {
            width: '250px',
            // data: "you don't have permission to access!! move to login!"
            data: { title: "success", messege: "employee updated successfully", icon: "success" }
          });
          dialogRef.afterClosed().subscribe((result: any) => {
            console.log('The dialog was closed');
            this.toLoginPage()
          });
        },
        error: (error) => {
          console.error(error);
          // Handle error appropriately
          const dialogRef = this.dialog.open(DialogMessegeComponent, {
            width: '250px',
            // data: "you don't have permission to access!! move to login!"
            data: { title: "error", messege: "its error on update employee!", icon: "error" }
          });
          dialogRef.afterClosed().subscribe((result: any) => {
            console.log('The dialog was closed');
            this.toLoginPage()
          });
        }
      });
    } else {
      // Form is invalid, display error message or take appropriate action
      const dialogRef = this.dialog.open(DialogMessegeComponent, {
        width: '250px',
        // data: "you don't have permission to access!! move to login!"
        data:{title:"error",messege:"Please fill out all required fields",icon:"error"}
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log('The dialog was closed');
        this.toLoginPage()
      });
    }
  }
  submitForm(): boolean {
    this.validationErrors = []; // Reset validation errors array before checking
    this.checkAndLogControlErrors(this.employeeForm); // Check and log control errors
    if (this.validationErrors.length === 0) {
      this.sendData();
      return true;
    } else {
      console.log("Validation errors:", this.validationErrors);
      console.log("Error!! Form is invalid.");
      return false;
    }
  }

  checkAndLogControlErrors(control: AbstractControl, controlName: string = '') {
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(key => {
        this.checkAndLogControlErrors(control.get(key) as AbstractControl, `${controlName}.${key}`);
      });
    } else if (control instanceof FormArray) {
      (control as FormArray).controls.forEach((arrayControl, index) => {
        this.checkAndLogControlErrors(arrayControl, `${controlName}[${index}]`);
      });
    } else {
      const controlErrors = control.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          const errorMessage = `Control: ${controlName}, Error: ${keyError}, Value: ${controlErrors[keyError]}`;
          this.validationErrors.push(errorMessage); // Store validation error in the component's array
        });
      } else {
        // If there are no errors, remove the error message from the validationErrors array
        const errorMessageIndex = this.validationErrors.findIndex(msg => msg.startsWith(`Control: ${controlName}`));
        if (errorMessageIndex !== -1) {
          this.validationErrors.splice(errorMessageIndex, 1);
        }
      }
    }
  }
  logControlErrors(control: AbstractControl, controlName: string = '') {
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(key => {
        this.logControlErrors(control.get(key) as AbstractControl, `${controlName}.${key}`);
      });
    } else if (control instanceof FormArray) {
      (control as FormArray).controls.forEach((arrayControl, index) => {
        this.logControlErrors(arrayControl, `${controlName}[${index}]`);
      });
    } else {
      const controlErrors = control.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log(`Control: ${controlName}, Error: ${keyError}, Value: ${controlErrors[keyError]}`);
        });
      }
    }
  }
  sendData() {
    console.log("Form data:", this.employeeForm.value);
    this.employeeToUpdate = this.employeeForm.value
    this.employeeRoles = this.employeeForm.get('employeeRoles')?.value;

    console.log("employee----- ", this.employeeToUpdate, "role-----", this.employeeRoles)
    for (let i = 0; i < this.employeeRoles.length; i++) {
      this.employeeRolePostModel.roleId = Number(this.employeeRoles[i].roleName)
      console.log("employPostModel.roleId----", this.employeeRolePostModel.roleId)
      this.employeeRolePostModel.entryDate = this.employeeRoles[i].entryDate
      this.employeeRolePostModel.isManagementRole = this.employeeRoles[i].isManagementRole
      this.employeeRoleResult.push(this.employeeRolePostModel)



    }
    console.log("this.employeeRoleResult----", this.employeeRoleResult)
    this.employeeToUpdate.maleOrFmale = this.employee.maleOrFmale
    if (this.employeeForm.get('maleOrFmale')?.value == "0") {
      this.employeeToUpdate.maleOrFmale = true;
    }
    this.employeeToUpdate.companyId = this.employee.companyId
    this.employeeToUpdate.status = this.employee.status

    console.log("employee before send-----", this.employeeToUpdate)
    this._employeeService.updateEmployee(this.employeeToUpdate).subscribe({
      next: (res) => {
        console.log("res----update employee", res)
        const dialogRef = this.dialog.open(DialogMessegeComponent, {
          width: '250px',
          // data: "Employee updated successfully!!"
          data: { title: "success", messege: "Employee updated successfully!!", icon: "check_circle" }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      },
      error: (err) => {
        console.error(err)
        if (err.status != 500) {
          const dialogRef = this.dialog.open(DialogMessegeComponent, {
            width: '250px',
            // data: "you don't have permission to access!! move to login!"
            data: { title: "error", messege: "you don't have permission to access!! move to login!", icon: "error" },
          });
          dialogRef.afterClosed().subscribe((result: any) => {
            console.log('The dialog was closed');
            this.toLoginPage()
          });
        }
        else {
          const dialogRef = this.dialog.open(DialogMessegeComponent, {
            width: '250px',
            // data: "its error on update employee!!"
            data: { title: "error", messege: "its error on update employee!!", icon: "error" },
          });
          dialogRef.afterClosed().subscribe((result: any) => {
            console.log('The dialog was closed');
          });
        }
      }
    })
    console.log("employee after send-----", this.employee)
  }
  toLoginPage() {
    this.router.navigate(['login']);
  }


  identityFormatValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const identityRegex = /^\d{9}$/; // Adjust this regex according to your identity format
    return identityRegex.test(control.value) ? null : { 'invalidIdentityFormat': true };
  }
  dateOfBirthValidator(control: AbstractControl): { [key: string]: boolean } | null {
    this.dateOfBirth = new Date(control.value);
    const currentDate = new Date();
    const minDateOfBirth = new Date();
    minDateOfBirth.setFullYear(currentDate.getFullYear() - 18);

    if (this.dateOfBirth > currentDate || this.dateOfBirth > minDateOfBirth) {
      return { 'invalidDateOfBirth': true };
    }
    return null;
  }

  entryDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = control.parent?.get('startDate')?.value;
    const entryDate = control.value;
    return startDate && entryDate && entryDate >= startDate ? null : { 'entryDateBeforeStartDate': true };
  }
  startDateValidator(control: AbstractControl): { [key: string]: any } | null {
    const selectedDate = control.value;
    if (selectedDate && this.employeeForm && this.employeeForm.get('dateOfBirth')) {
      const currentDate = new Date();
      const startDate = new Date(selectedDate);
      const dobControl = this.employeeForm.get('dateOfBirth');
      // Check if dobControl is defined and has a value
      if (dobControl && dobControl.value) {
        const birthDate = new Date(dobControl.value);
        const minAgeDate: Date = new Date(birthDate.getFullYear() + 18, birthDate.getMonth(), birthDate.getDate());

        // const minAgeDate: Date = new Date(birthDate.getFullYear() + 18, birthDate.getMonth(), birthDate.getDate());
        // Check if the selected date is greater than the current date
        if (startDate > currentDate) {
          return { futureDate: true }; // Return error if the selected date is in the future
        }

        // Check that the age is greater than 18
        // const ageDiff = currentDate.getFullYear() - dob.getFullYear();
        if (startDate < minAgeDate) {
          return { underAge: true }; // Return error if age is less than 18
        }
      }
    }
    return null; // If the date passes all checks, return null (valid)
  }
  startDateBeforeEntryDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = this.employeeForm.get('startDate');
    const entryDate = control.value;

    // Check if both startDate and entryDate are valid and entryDate is after startDate
    if (startDate && startDate.value && entryDate && entryDate > startDate.value) {
      return null; // Valid
    } else {
      return { 'startDateBeforeEntryDate': true }; // Invalid
    }
  }
  roleNameNotDuplicateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const employeeRoles = control.value as { roleName: string }[];
    const roleNameSet = new Set();
    for (const role of employeeRoles) {
      if (roleNameSet.has(role.roleName)) {
        return { 'roleNameDuplicate': true };
      }
      roleNameSet.add(role.roleName);
    }
    return null;
  }
  roleNameValidator(index: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedRoleNames = this.employeeRolesFormArray.value.map((role: { roleName: string }) => role.roleName);
      const roleName = control.value;
      if (selectedRoleNames.slice(0, index).includes(roleName) || selectedRoleNames.slice(index + 1).includes(roleName)) {
        return { 'roleNameDuplicate': true };
      }
      return null;
    };
  }
  filteredRoles(index: number): Role[] {
    if (!this.employeeRolesFormArray || !this.rolesList) {
      console.log("rolesList-check", this.rolesList, this.employeeRolesFormArray)
      // this.isRolesListEmpty=true;
      return [];
    }
    const selectedRoles = this.employeeRolesFormArray.controls
      .filter((control, i) => i !== index) // סנן את התפקידים שאינם שווים לאינדקס שנמצא בפרמטר
      .map(roleGroup => roleGroup.get('roleId')?.value);
    this.newRoleList = this.rolesList.filter(role => !selectedRoles.includes(role.roleId));
    // return this.rolesList.filter(role => !selectedRoles.includes(role.roleId));
    if (this.newRoleList.length == 1) {
      console.log("the roles are finished")
      this.isRolesListEmpty = true;
    }

    return this.newRoleList;
  }
}
