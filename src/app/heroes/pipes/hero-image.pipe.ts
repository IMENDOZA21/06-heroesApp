import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroImage'
})
export class HeroImagePipe implements PipeTransform {

  transform(hero: Hero, ext: string = 'jpg'): string {
    if (!hero.id && !hero.alt_img) {
      return 'assets/no-image.png';
    } else if (hero.alt_img){
      return hero.alt_img;
    }

    return `assets/heroes/${hero.id}.${ext}`;
  }

}
