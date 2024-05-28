

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import {
  MatDialog,
} from '@angular/material/dialog';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import { Employee } from '../../../entities/employee.entites';
import { EditEmployeeDialogComponent } from '../edit-employee-dialog/edit-employee-dialog.component';
import { RoleService } from '../../../services/role/role.service';
import { Role } from '../../../entities/role.entites';
import { EmployeeService } from '../../../services/employee/employee.service';
import { DialogMessegeComponent } from '../../dialogs/dialog-messege/dialog-messege.component';
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, FormsModule,
    MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule
    ,MatTooltipModule

  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = [ 'identity','firstName', 'lastName', 'startDate', 'actions'];
  dataSource: MatTableDataSource<Employee>;

  filteredStatusEmployeeList: Employee[] = [];
  filteredCompanyIdEmployeeList: Employee[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  employeeList!: Employee[];
  employeeFromEdit: any;
  token: any;
  companyId: any;
  rolesList!: Role[];
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: Employee, filter: string) => {
      // Convert startDate to string before applying toLowerCase()
      const startDateString = data.startDate ? data.startDate.toString().toLowerCase() : '';

      // Check if the filter value is present in any of the fields
      return data.firstName.toLowerCase().includes(filter) ||
        data.lastName.toLowerCase().includes(filter) ||
        data.identity.toLowerCase().includes(filter) ||
        startDateString.includes(filter);
    };

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  constructor(private _employeeService: EmployeeService, public dialog: MatDialog
    , private router: Router, private _roleServices: RoleService) {
    this.dataSource = new MatTableDataSource<Employee>();
  }
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
    console.log("start")
    setTimeout(() => {
      this.getEmployeeList()
    }, 1000); 

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getEmployeeList() {
    this.foundCompanyIdFromToken()
    this._employeeService.getEmployeeList().subscribe({
      next: (res) => {
        console.log("res", res)
        this.employeeList = res;
        this.employeeList = res.filter(employee => employee.status && employee.companyId === Number(this.companyId));
        this.dataSource.data = this.employeeList;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err)
        if (err.status!=500) {
          const dialogRef = this.dialog.open(DialogMessegeComponent, {
            width: '250px',
            // data: "you don't have permission to access!! move to login!"
            data:{title:"error",messege:"you don't have permission to access!! move to login!",icon:"error"}
          });
          dialogRef.afterClosed().subscribe((result: any) => {
            console.log('The dialog was closed');
            this.toLoginPage()
          });
        }
        else {
          const dialogRef = this.dialog.open(DialogMessegeComponent, {
            width: '250px',
            // data: "its error on get-employee-list"
            data: {title:"error",messege:"its error on get-employee-list", icon:"error"}
          });
          dialogRef.afterClosed().subscribe((result: any) => {
            console.log('The dialog was closed');
          });
        }
      }
    })

  }
  filterEmployeesByCompanyId() {
    console.log("this.companyId", this.companyId)
    this.employeeList = this.employeeList.filter(employee => employee.companyId === Number(this.companyId));
    console.log("this.employeeList", this.employeeList)
  }
  foundCompanyIdFromToken() {
    if (typeof sessionStorage !== 'undefined') {
      this.token = sessionStorage.getItem('token');
    }
    else{
      console.error('sessionStorage is not available');
    }
    if (this.token) {
      // Decode the token
      try {
        const tokenPayload: any = JSON.parse(atob(this.token.split('.')[1]));
        // Access the id property
        if (tokenPayload && typeof tokenPayload === 'object' && 'id' in tokenPayload) {
          this.companyId = tokenPayload.id;
          console.log("Company ID:", this.companyId);
        } else {
          console.error("Invalid token format or missing id property");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("Token not found in sessionStorage");
    }
  }
  toLoginPage() {
    this.router.navigate(['/login']);
  }
  editEmployee(employee: Employee) {
    const dialogRef = this.dialog.open(EditEmployeeDialogComponent, {
      width: '80vh',
      data: employee,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed');
      this.employeeFromEdit = result;
      this.getEmployeeList()
    });
  }
  deleteEmployee(employee: Employee) {
    var message=" Would you like to delete this employee with identity "+employee.identity+"?"
    const dialogRef = this.dialog.open(DialogMessegeComponent, {
      width: '250px',
      data:{title:"delete ",messege:message,icon:"delete",isCancelButon:true}

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User clicked Ok');
        this._employeeService.deleteEmployee(employee.identity).subscribe({
          next: (res) => {
            console.log("res", res)
            // this.getStatusFilteredEmployeeList()
            this.getEmployeeList()
            const dialogRef = this.dialog.open(DialogMessegeComponent, {
              width: '250px',
              // data: "the employee has been deleted!!!"
              data:{title:"success",messege:"the employee has been deleted!!",icon:"check_circle"}
            });
            dialogRef.afterClosed().subscribe(result => {
              console.log('The dialog was closed');
            });
          },
          error: (err) => {
            console.log(err)
          }
        })
      } else {
        console.log('User clicked No');
      }
    });
  }
  addEmployee(): void {
    this.router.navigate(["add-employee"]);
  }
  exportToExcel(): void {
    const data: any[] = this.dataSource.filteredData.map((employee: Employee) => {
      let roles: string = '';
      if (employee.employeeRoles && employee.employeeRoles.length > 0) {
        roles = employee.employeeRoles.map(role => this.getRoleName(role.roleId)).join(', ');
        console.log("roles list", roles)
      }
      return {
        'Identity': employee.identity,
        'First Name': employee.firstName,
        'Last Name': employee.lastName,
        'Date of Birth': employee.dateOfBirth || 'N/A',
        'Gender': employee.maleOrFmale ? 'Male' : 'Female',
        'Start Date Working': employee.startDate || 'N/A',
        'Company ID': employee.companyId,
        'Roles': roles,
      };
    });
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');
  
    // Generate a file name
    const fileName = 'employees.xlsx';
  
    // Save the file
    XLSX.writeFile(wb, fileName);
  }
  getRoleName(roleId: number): string {
    const role = this.rolesList.find(role => role.roleId === roleId);
    console.log("role", role?.roleName)
    return role ? role.roleName : '';
  }
}

