import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../../shared/recipe.service';
import { Recipe } from '../../shared/recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css']
})
export class EditRecipeComponent implements OnInit, OnDestroy {
  recipeForm!: FormGroup;
  recipe!: Recipe;
  recipeUploadingSubscription!: Subscription;
  isUploading = false;
  editedId = '';
  isEdit = false;

  constructor(private recipeService: RecipeService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) {
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
    this.route.data.subscribe(data => {
      this.recipe = <Recipe>data.recipe;

      if (this.recipe) {
        this.editedId = this.recipe.id;
        this.isEdit = true;
        this.seedSteps();
        this.recipeForm.patchValue({
          dishName: this.recipe.dishName,
          dishDescription: this.recipe.dishDescription,
          dishImageUrl: this.recipe.dishImageUrl,
          dishIngredients: this.recipe.dishIngredients,
        });
      } else {
        this.editedId = '';
        this.isEdit = false;
        this.recipeForm.patchValue({
          dishName: '',
          dishDescription: '',
          dishImageUrl: '',
          dishIngredients: '',
          steps: [],
        });
      }
    });
  }

  saveRecipe() {
    const id = this.editedId || Math.random().toString();

    const recipe = new Recipe(id,
      this.recipeForm.value.dishName,
      this.recipeForm.value.dishDescription,
      this.recipeForm.value.dishImageUrl,
      this.recipeForm.value.dishIngredients,
      this.recipeForm.value.steps);

    const next = () => {
      this.recipeService.fetchRecipes();
      if (!this.isEdit) {
        void this.router.navigate(['']);
      }
    }

    if (this.isEdit) {
      this.recipeService.editRecipe(recipe).subscribe(next);
    } else {
      this.recipeService.addRecipe(recipe).subscribe(next);
    }
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

  getStepGroup(image: string, description: string): FormGroup {
    return this.formBuilder.group({
      stepImageUrl: [image, Validators.required],
      stepDescription: [description, Validators.required],
    });
  }

  seedSteps() {
    const steps = <FormArray>this.recipeForm.get('steps');
    for (let i = 0; i < this.recipe.steps.length; i++) {
      const step = this.getStepGroup(this.recipe.steps[i].stepImageUrl, this.recipe.steps[i].stepDescription);
      steps.push(step);
    }
  }

  ngOnDestroy() {
    this.recipeUploadingSubscription.unsubscribe();
  }
}
