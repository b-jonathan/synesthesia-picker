import { Component, signal, computed, inject } from '@angular/core';
import { prominent } from 'color.js';
import { ColorBlock } from '../../components/color-block/color-block';
import { RecipeList } from '../../components/recipe-list/recipe-list';
import { UploadStateService } from '../../services/upload-state';
import { Ingredients } from '../../components/ingredients/ingredients';

@Component({
  selector: 'app-upload',
  imports: [ColorBlock, RecipeList, Ingredients],
  providers: [UploadStateService],
  templateUrl: './upload.html',
})
export class Upload {
  private state = inject(UploadStateService);

  imageFile = signal<File | null>(null);

  imageUrl = computed(() => {
    const file = this.imageFile();
    return file ? URL.createObjectURL(file) : null;
  });

  // Expose state
  prominentColors = this.state.prominentColors;
  matchedIngredients = this.state.matchedIngredients;
  recipes = this.state.recipes;
  isLoading = this.state.isLoading;
  error = this.state.error;

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.imageFile.set(file || null);

    if (!file) {
      this.state.reset();
      return;
    }

    try {
      const prominentColors = await prominent(this.imageUrl() as string, {
        format: 'hex',
        amount: 5,
      });
      this.state.setProminentColors(prominentColors as string[]);
    } catch (error) {
      console.error('Error extracting colors:', error);
    }
  }

  async fetchRecipes(): Promise<void> {
    await this.state.fetchRecipes();
  }
}
