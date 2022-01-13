import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../shared/recipe.model';
import { Subscription } from 'rxjs';
import { RecipeService } from '../shared/recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit, OnDestroy {
  recipes: Recipe[] | undefined = undefined;
  recipesFetchingSubscription!: Subscription;
  recipesChangeSubscription!: Subscription;
  isFetching = false;

  constructor(private recipeService: RecipeService) {
  }

  ngOnInit(): void {
    this.recipesFetchingSubscription = this.recipeService.recipesFetching.subscribe(isFetching => {
      this.isFetching = isFetching;
    });
    this.recipesChangeSubscription = this.recipeService.recipesChange.subscribe(recipes => {
      this.recipes = recipes;
    });
    this.recipeService.fetchRecipes();
  }

  ngOnDestroy(): void {
    this.recipesFetchingSubscription.unsubscribe();
    this.recipesChangeSubscription.unsubscribe();
  }

}
