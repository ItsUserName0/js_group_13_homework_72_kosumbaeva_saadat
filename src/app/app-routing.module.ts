import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { EditRecipeComponent } from './recipes/edit-recipe/edit-recipe.component';
import { RecipeDetailsComponent } from './recipes/recipe-details/recipe-details.component';
import { RecipeResolverService } from './recipes/recipe-resolver.service';

const routes: Routes = [
  {path: '', component: RecipesComponent},
  {path: 'recipes/new', component: EditRecipeComponent},
  {
    path: 'recipes/:id', component: RecipeDetailsComponent, resolve: {
      recipe: RecipeResolverService,
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
