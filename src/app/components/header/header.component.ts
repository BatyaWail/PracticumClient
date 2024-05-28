import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Company } from '../../entities/company.entites';
import { CompanyService } from '../../services/company/company.service';
import { DialogMessegeComponent } from '../dialogs/dialog-messege/dialog-messege.component';
// import { DialogMessegeComponent } from '../../dialog-messege/dialog-messege.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatSidenavModule, MatToolbarModule, MatIconModule,
    MatButtonModule, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private storageEventListener: any;
  private storageChangesSubscription!: Subscription;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  company!: Company;
  companyId: any;
  companyName: any;
  token: any;
  @Input() receivedToken: string = '';

  constructor(private router: Router, private companyService: CompanyService, public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.storageEventListener = (event: StorageEvent) => {
      if (event.key === 'token') {
        this.foundCompanyNameFromToken();
      }
    };
    // Listen for changes in sessionStorage
    window.addEventListener('storage', this.storageEventListener);
    // Call the function initially
    this.foundCompanyNameFromToken();
  }
  ngOnDestroy(): void {
    // Unsubscribe from the subscription
    console.log("component destroyed");
  }
  scrolled: boolean = false;

  @HostListener('window:scroll', ['$event'])
  foundCompanyNameFromToken() {
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
        if (tokenPayload && typeof tokenPayload === 'object' && 'name' in tokenPayload) {
          this.companyName = tokenPayload.name;
          console.log("Company Name:", this.companyName);
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

  onWindowScroll() {
    this.scrolled = window.scrollY > 0;
  }
  aboutUs() {
    this.router.navigate(['about-us']);
  }
  login() {
    this.router.navigate(['login']);
  }
  employeeList() {
    this.router.navigate(['employee-list']);
  }
  addEmployee() {
    this.router.navigate(['add-employee']);
  }
  logOut() {
    this.foundCompanyNameFromToken();
    var message = " Would you like to logout from " + this.companyName + " company?"
    const dialogRef = this.dialog.open(DialogMessegeComponent, {
      width: '250px',
      data: { title: "logout", messege: message, icon: "logout", isCancelButon: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // אם נבחר למחוק
        console.log('User clicked Ok');
        sessionStorage.removeItem('token');
        const dialogRef = this.dialog.open(DialogMessegeComponent, {
          width: '250px',
          // data: "the employee has been deleted!!!"
          data: { title: "success", messege: "you have been logged out!", icon: "check_circle" }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      } else {
        console.log('User clicked No');
      }
    });
  }
  home() {
    this.router.navigate(['home']);
  }
}