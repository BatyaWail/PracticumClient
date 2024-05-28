import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoginModel } from '../../entities/login.model';
import { AuthService } from '../../services/auth/auth.service';
import { CompanyService } from '../../services/company/company.service';
import { Company } from '../../entities/company.entites';
import { DialogMessegeComponent } from '../dialogs/dialog-messege/dialog-messege.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule, MatSelectModule, CommonModule, FormsModule, CommonModule,MatTooltipModule,
    MatOptionModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    //  private header: HeaderComponent,
    private router: Router,
    private companyService: CompanyService,private authService: AuthService,public dialog: MatDialog,
  ) { }
  hide = true;
  companies: Company[] = [];
  @Output() tokenSaved = new EventEmitter<string>();
  isNameAndPasswordValid: boolean=false;

  ngOnInit(): void {
    // this._employeeService.getEmployeeList().subscribe({
    //   next: (res) => {
    this.companyService.getAllCompanies().subscribe({
      next: (res) => {
        console.log(res);
        this.companies = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  AddCompany() {
    this.router.navigate(['/add-company']);
  }
  login(): void {
    if (this.loginForm.valid) {
      const loginModel: LoginModel = this.loginForm.value;
      this.authService.login(loginModel).subscribe(
        (response) => {
          const token = response.token;
          console.log("token", token);
          sessionStorage.setItem('token', token);

          // this.checkNameAndPassword();
          this.router.navigate(['/employee-list']);
        },
        (error) => {
          const dialogRef = this.dialog.open(DialogMessegeComponent, {
            width: '250px',
            // data: "the employee has been deleted!!!"
            data:{title:"error",messege:"the password is not correct!!",icon:"error"}
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
          });
        }
      );
    }
  }
  toEmployeeList() {
    this.router.navigate(['employee-list']);
  }
}

