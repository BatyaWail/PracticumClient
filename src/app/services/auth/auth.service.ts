import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginModel } from '../../entities/login.model';
interface LoginResponse {
  token: string;
  
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public baseUrlAuth = 'https://localhost:7031/api/Auth'

  constructor(private http: HttpClient) { }
  login(loginModel:LoginModel):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(this.baseUrlAuth,loginModel)
  }
  getIsValidToken():Observable<boolean>{
    const headers=new HttpHeaders({
      'Authorization':`Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<boolean>('https://localhost:7215/api/Auth/verifyToken',{headers});
  }

}