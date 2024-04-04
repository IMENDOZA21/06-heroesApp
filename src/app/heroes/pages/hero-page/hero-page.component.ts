import { Component, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: ``
})
export class HeroPageComponent implements OnInit {

  public hero?: Hero;

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById(id)),
        // delay(2000) // Simular lentitud
      ).subscribe(hero => {
        if(!hero) return this.router.navigate(['/heroes/list']);
        return this.hero = hero;
      });
  }

  public goBack(): void {
    this.router.navigateByUrl('/heroes/list');
  }
}
