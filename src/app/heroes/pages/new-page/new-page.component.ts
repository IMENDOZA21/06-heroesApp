import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl('')
  });

  public publishers = [
    {
      id: 'DC Comics',
      value: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      value: 'Marvel - Comics'
    }
  ]

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById(id))
      ).subscribe( hero => {

        if(!hero) return this.router.navigateByUrl('/');

        return this.heroForm.reset( hero );
      });
  }

  get curretHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return;

    if (this.curretHero.id) {
      this.heroesService.updateHero(this.curretHero)
        .subscribe(hero => {
          this.showSnakbar(`${hero.superhero} updated!`);
        });
    } else {
      this.heroesService.addHero(this.curretHero)
        .subscribe(hero => {
          this.router.navigate(['/heroes/edit', hero.id ]);
          this.showSnakbar(`${hero.superhero} created!`);
        });
    }
  }

  onDeleteHero(): void{
    if(!this.curretHero.id) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;

      this.heroesService.deleteHerobyId(this.curretHero.id);
      this.router.navigate(['/heroes']);
    });
  }

  showSnakbar(message: string): void{
    this.snackbar.open( message, 'done', {
      duration: 2500
    })
  }
}
