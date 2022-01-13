import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  recipes: Recipe[] = [];
  recipesChange = new Subject<Recipe[]>();
  recipeUploading = new Subject<boolean>();
  recipesFetching = new Subject<boolean>();

  constructor(private http: HttpClient) {
  }

  fetchRecipes() {
    this.recipesFetching.next(true);
    this.http.get<{[id: string]: Recipe}>('https://skosumbaeva2502-default-rtdb.firebaseio.com/recipes.json').pipe(
      map(data => {
        return Object.keys(data).map(id => {
          const recipe = data[id];
          return new Recipe(id, recipe.dishName, recipe.dishDescription, recipe.dishImageUrl, recipe.dishIngredients, recipe.steps);
        })
      })
    ).subscribe(result => {
      this.recipes = result;
      this.recipesChange.next(result);
      this.recipesFetching.next(false);
    }, () => {
      this.recipesFetching.next(false);
    });
  }

  addRecipe(recipe: Recipe) {
    const data = {
      dishName: recipe.dishName,
      dishDescription: recipe.dishDescription,
      dishImageUrl: recipe.dishImageUrl,
      dishIngredients: recipe.dishIngredients,
      steps: recipe.steps,
    };
    this.recipeUploading.next(true);
    return this.http.post(`https://skosumbaeva2502-default-rtdb.firebaseio.com/recipes.json`, data).pipe(
      tap(() => {
        this.recipeUploading.next(false);
      }, () => {
        this.recipeUploading.next(false);
      })
    );
  }
}
