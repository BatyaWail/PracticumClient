import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent) },
    { path: 'employee-list', loadComponent: () => import('./components/employee/employee-list/employee-list.component').then(c => c.EmployeeListComponent) },
    { path: 'add-employee', loadComponent: () => import('./components/employee/add-employee/add-employee.component').then(c => c.AddEmployeeComponent) },
    {path:'about-us',loadComponent:()=>import('./components/about-us/about-us.component').then(c=>c.AboutUsComponent)},
    {path:'login',loadComponent:()=>import('./components/login/login.component').then(c=>c.LoginComponent)},
    {path:'add-company',loadComponent:()=>import('./components/add-company/add-company.component').then(c=>c.AddCompanyComponent)},
    {path:'**',loadComponent:()=>import('./components/not-found/not-found.component').then(c=>c.NotFoundComponent)},


];
