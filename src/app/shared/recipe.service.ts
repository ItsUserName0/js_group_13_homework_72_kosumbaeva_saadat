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
  recipeRemoving = new Subject<boolean>();

  constructor(private http: HttpClient) {
  }

  fetchRecipes() {
    this.recipesFetching.next(true);
    this.http.get<{ [id: string]: Recipe }>('https://skosumbaeva2502-default-rtdb.firebaseio.com/recipes.json').pipe(
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

  fetchRecipe(id: string) {
    return this.http.get<Recipe | null>(`https://skosumbaeva2502-default-rtdb.firebaseio.com/recipes/${id}.json`).pipe(
      map(result => {
        if (!result) return null;
        return new Recipe(id, result.dishName, result.dishDescription, result.dishImageUrl, result.dishIngredients, result.steps);
      })
    )
  }

  addRecipe(recipe: Recipe) {
    const body = {
      dishName: recipe.dishName,
      dishDescription: recipe.dishDescription,
      dishImageUrl: recipe.dishImageUrl,
      dishIngredients: recipe.dishIngredients,
      steps: recipe.steps,
    };
    this.recipeUploading.next(true);
    return this.http.post(`https://skosumbaeva2502-default-rtdb.firebaseio.com/recipes.json`, body).pipe(
      tap(() => {
        this.recipeUploading.next(false);
      }, () => {
        this.recipeUploading.next(false);
      })
    );
  }

  editRecipe(recipe: Recipe) {
    const body = {
      dishName: recipe.dishName,
      dishDescription: recipe.dishDescription,
      dishImageUrl: recipe.dishImageUrl,
      dishIngredients: recipe.dishIngredients,
      steps: recipe.steps,
    };
    this.recipeUploading.next(true);
    return this.http.put(`https://skosumbaeva2502-default-rtdb.firebaseio.com/recipes/${recipe.id}.json`, body).pipe(
      tap(() => {
        this.recipeUploading.next(false);
      }, () => {
        this.recipeUploading.next(false);
      })
    );
  }

  removeRecipe(id: string) {
    this.recipeRemoving.next(true);
    return this.http.delete(`https://skosumbaeva2502-default-rtdb.firebaseio.com/recipes/${id}.json`).pipe(
      tap(() => {
        this.recipeRemoving.next(false);
      }, () => {
        this.recipeRemoving.next(false);
      })
    );
  }
}
