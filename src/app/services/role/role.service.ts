import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../../entities/role.entites';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  public baseUrlRole = 'https://localhost:7031/api/Role'

  constructor(private http: HttpClient) { }



  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.baseUrlRole)
  }
}
