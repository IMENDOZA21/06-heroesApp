import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/enviroments';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private baseURL: string = environments.baseURL;
  private pagsize: number = 6;

  constructor(private http: HttpClient) { }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseURL}/heroes`);
  }

  getHeroById(id: string): Observable<Hero | undefined> {
    return this.http.get<Hero>(`${this.baseURL}/heroes/${id}`)
      .pipe(
        catchError(err => {
          console.error('Error al ejecutar la petición', err);
          return of(undefined);
        })
      );
  }

  getSuggestions(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseURL}/heroes?q=${query}&_limit=${this.pagsize}`);
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${this.baseURL}/heroes`, hero);
  }

  deleteHerobyId(id: string): Observable<boolean> {
    if (!id) throw Error('Hero id is required');
    return this.http.delete(`${this.baseURL}/heroes/${id}`)
      .pipe(
        map( resp => true),
        catchError(err => {
          console.log(err);
          return of(false);
        })
      );
  }

  updateHero(hero: Hero): Observable<Hero> {
    if (!hero.id) throw Error('Hero id is required');
    return this.http.patch<Hero>(`${this.baseURL}/heroes/${hero.id}`, hero);
  }
}
