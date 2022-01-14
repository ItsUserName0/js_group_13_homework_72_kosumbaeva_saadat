import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../../shared/recipe.model';
import { RecipeService } from '../../shared/recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit, OnDestroy {
  @Input() recipe!: Recipe;
  recipeRemovingSubscription!: Subscription;
  isRemoving = false;
  removingId = '';

  constructor(private recipeService: RecipeService) {
  }

  ngOnInit(): void {
    this.recipeRemovingSubscription = this.recipeService.recipeRemoving.subscribe(isRemoving => {
      if (this.recipe.id === this.removingId) {
        this.isRemoving = isRemoving;
      }
    });
  }

  onRemove() {
    this.removingId = this.recipe.id;
    this.recipeService.removeRecipe(this.removingId).subscribe(() => {
      this.recipeService.fetchRecipes();
    });
  }

  ngOnDestroy(): void {
    this.recipeRemovingSubscription.unsubscribe();
  }

}
