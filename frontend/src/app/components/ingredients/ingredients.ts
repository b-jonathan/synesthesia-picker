import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-ingredients',
  imports: [],
  templateUrl: './ingredients.html',
})
export class Ingredients {
  // Inputs
  matchedIngredients = input<string[]>([]);
  isLoading = input<boolean>(false);

  // Outputs
  getRecipes = output<void>();

  onGetRecipes(): void {
    this.getRecipes.emit();
  }
}
