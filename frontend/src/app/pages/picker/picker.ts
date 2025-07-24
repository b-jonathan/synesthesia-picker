import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Ingredients } from '../../components/ingredients/ingredients';
import { RecipeList } from '../../components/recipe-list/recipe-list';
import { ColorPicker } from '../../components/color-picker/color-picker';
import { ColorPickerStateService } from '../../services/color-picker-state';

@Component({
  selector: 'app-picker',
  imports: [CommonModule, Ingredients, RecipeList, ColorPicker],
  providers: [ColorPickerStateService],
  templateUrl: './picker.html',
})
export class Picker {
  private state = inject(ColorPickerStateService);

  // Expose state for templates
  selectedColor = this.state.selectedColor;
  matchedIngredients = this.state.matchedIngredients;
  isLoading = this.state.isLoading;
  recipes = this.state.recipes;
  error = this.state.error;

  // Event handlers
  onColorChange(color: string): void {
    this.state.setSelectedColor(color);
  }

  async onGetRecipes(): Promise<void> {
    await this.state.fetchRecipes();
  }
}
