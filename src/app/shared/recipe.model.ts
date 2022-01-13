export class Recipe {
  constructor(public id: string,
              public dishName: string,
              public dishDescription: string,
              public dishImageUrl: string,
              public dishIngredients: string,
              public steps: [{stepImageUrl: string, stepDescription: string}]) {
  }
}
