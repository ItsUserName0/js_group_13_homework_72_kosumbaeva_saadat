import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Recipe } from '../shared/recipe.model';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { RecipeService } from '../shared/recipe.service';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RecipeResolverService implements Resolve<Recipe> {

  constructor(private recipeService: RecipeService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe> | Observable<never> {
    const id = route.params['id'];
    return this.recipeService.fetchRecipe(id).pipe(mergeMap(recipe => {
      if (recipe) return of(recipe);
      void this.router.navigate(['/']);
      return EMPTY;
    }));
  }

}
