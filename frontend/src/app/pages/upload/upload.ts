import {
  Component,
  signal,
  computed,
  inject,
  effect,
  OnDestroy,
} from '@angular/core';
import { prominent } from 'color.js';
import { ColorBlock } from '../../components/color-block/color-block';
import { FlavorService } from '../../services/flavor';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { AppStateService, Recipe } from '../../services/state';
import { RecipeService } from '../../services/recipe';
import { RecipeList } from '../../components/recipe-list/recipe-list';

@Component({
  selector: 'app-upload',
  imports: [ColorBlock, RecipeList],
  templateUrl: './upload.html',
})
export class Upload {
  flavorService = inject(FlavorService);
  recipeService = inject(RecipeService);

  imageFile = signal<File | null>(null);
  prominentColors = signal<string[]>([]);
  matchedIngredients = signal<Set<string>>(new Set());

  recipes = signal<Recipe[]>([]);

  imageUrl = computed(() => {
    const file = this.imageFile();
    return file ? URL.createObjectURL(file) : null;
  });

  constructor() {
    // Use effect to reactively process colors when they change
    effect(() => {
      const colors = this.prominentColors();
      if (colors.length > 0) {
        this.processColorsForIngredients(colors);
      }
    });

    effect(() => {
      const ingredients = this.matchedIngredients();

      if (ingredients.size > 0) {
        this.recipeService.fetchRecipes(Array.from(ingredients)).subscribe({
          next: (recipes) => {
            this.recipes.set(recipes);
          },
        });
      }
    });
  }

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.imageFile.set(file || null);

    if (!file) return;

    try {
      const prominentColors = await prominent(this.imageUrl() as string, {
        format: 'hex',
        amount: 5,
      });
      this.prominentColors.set(prominentColors as string[]);
    } catch (error) {
      console.error('Error extracting colors:', error);
    }
  }

  private processColorsForIngredients(colors: string[]) {
    // Clear previous ingredients
    this.matchedIngredients.set(new Set());

    // Create observables for all color queries
    const colorQueries = colors.map((color, index) =>
      this.flavorService.queryFoodByColor(color, Math.min(5, index + 1))
    );

    // Execute all queries in parallel and combine results
    forkJoin(colorQueries).subscribe({
      next: (allIngredients) => {
        const combinedIngredients = new Set<string>();

        // Add ingredients from each color, with priority to earlier colors
        allIngredients.forEach((ingredients, colorIndex) => {
          ingredients.forEach((ingredient, ingredientIndex) => {
            // Limit total ingredients based on color priority
            if (combinedIngredients.size < (colorIndex + 1) * 2) {
              combinedIngredients.add(ingredient);
            }
          });
        });

        this.matchedIngredients.set(combinedIngredients);
      },
      error: (error) => {
        console.error('Error fetching ingredients:', error);
      },
    });
  }
}
