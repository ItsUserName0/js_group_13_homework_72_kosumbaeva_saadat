import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../../shared/recipe.service';
import { Recipe } from '../../shared/recipe.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css']
})
export class EditRecipeComponent implements OnInit, OnDestroy {
  recipeForm!: FormGroup;
  recipeUploadingSubscription!: Subscription;
  isUploading = false;

  constructor(private recipeService: RecipeService, private router: Router) {
  }

  ngOnInit(): void {
    this.recipeForm = new FormGroup({
      dishName: new FormControl('', Validators.required),
      dishDescription: new FormControl('', Validators.required),
      dishImageUrl: new FormControl('', Validators.required),
      dishIngredients: new FormControl('', Validators.required),
      steps: new FormArray([], Validators.required),
    });
    this.recipeUploadingSubscription = this.recipeService.recipeUploading.subscribe(isUploading => {
      this.isUploading = isUploading;
    });
  }

  saveRecipe() {
    const id = Math.random().toString();
    const recipe = new Recipe(id,
      this.recipeForm.value.dishName,
      this.recipeForm.value.dishDescription,
      this.recipeForm.value.dishImageUrl,
      this.recipeForm.value.dishIngredients,
      this.recipeForm.value.steps);
    const next = () => {
      this.recipeService.fetchRecipes();
      void this.router.navigate(['']);
    }
    this.recipeService.addRecipe(recipe).subscribe(next);
  }

  addStep() {
    const steps = <FormArray>this.recipeForm.get('steps');
    const step = new FormGroup({
      stepImageUrl: new FormControl('', Validators.required),
      stepDescription: new FormControl('', Validators.required),
    });
    steps.push(step);
  }

  getStepControls() {
    const steps = <FormArray>this.recipeForm.get('steps');
    return steps.controls;
  }

  fieldHasError(fieldName: string, errorType: string, index?: number) {
    if (fieldName === 'stepImageUrl' || fieldName === 'stepDescription') {
      const steps = <FormArray>this.recipeForm.get('steps');
      if (!index) {
        index = 0;
      }
      const step = <FormGroup>steps.controls[index];
      const field = step.get(fieldName);
      return field && field.touched && field.errors?.[errorType];
    }

    const field = this.recipeForm.get(fieldName);
    return field && field.touched && field.errors?.[errorType];
  }

  ngOnDestroy() {
    this.recipeUploadingSubscription.unsubscribe();
  }
}
