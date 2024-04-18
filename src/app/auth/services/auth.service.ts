import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/enviroments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, delay, map, of, retry, retryWhen, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environments.baseURL;
  private user?: User;

  constructor(
    private http: HttpClient
  ) { }

  get currentUser(): User | undefined {
    if (!this.user) return undefined;
    return structuredClone(this.user);
  }

  login(email: string, pwd: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap(user => this.user = user),
        tap(user => localStorage.setItem('token', 'eesefesfsf.2132d1d.21ddee.fdsfsf'))
      );
  }

  logout(): void {
    this.user = undefined;
    localStorage.clear();
  }

  checkAuthentication(): Observable<boolean>{
    if (!localStorage.getItem('token')) return of(false);

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap(user => this.user = user),
        map(user => !!user),
        catchError(err => {
          console.error('Error al ejecutar la peticion',err);
          return of(false);
        })
      );
  }
}
