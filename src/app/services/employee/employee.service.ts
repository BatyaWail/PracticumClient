import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../../entities/employee.entites';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  public baseUrlEmployee = 'https://localhost:7031/api/Employee';

  constructor(private http: HttpClient) { }

  addEmployee(employee: Employee): Observable<Employee> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
    return this.http.post<Employee>(this.baseUrlEmployee, employee, { headers });
  }

  getEmployeeList(): Observable<Employee[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
    return this.http.get<Employee[]>(this.baseUrlEmployee, { headers });
  }

  deleteEmployee(identity: string): Observable<Employee> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
    return this.http.delete<Employee>(`${this.baseUrlEmployee}/${identity}`, { headers });
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
    return this.http.put<Employee>(`${this.baseUrlEmployee}/${employee.identity}`, employee, { headers });
  }

  getEmployeeById(identity: string): Observable<Employee> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
    return this.http.get<Employee>(`${this.baseUrlEmployee}/${identity}`, { headers });
  }
}
