import { Injectable, signal, computed, inject } from '@angular/core';
import { FlavorService } from './flavor';
import { RecipeService } from './recipe';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { Recipe } from '../types';

@Injectable()
export class UploadStateService {
  private destroy$ = new Subject<void>();
  private flavorService = inject(FlavorService);
  private recipeService = inject(RecipeService);

  // Core state signals
  private _prominentColors = signal<string[]>([]);
  private _matchedIngredients = signal<string[]>([]);
  private _recipes = signal<Recipe[]>([]);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly prominentColors = this._prominentColors.asReadonly();
  readonly matchedIngredients = this._matchedIngredients.asReadonly();
  readonly recipes = this._recipes.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Public actions
  setProminentColors(colors: string[]): void {
    this._prominentColors.set(colors);
    this._error.set(null);
    this.fetchIngredientsForColors(colors);
  }

  async fetchRecipes(): Promise<void> {
    const ingredients = this._matchedIngredients();
    if (ingredients.length === 0) return;

    this._isLoading.set(true);
    this._error.set(null);

    try {
      const recipes = await this.recipeService
        .fetchRecipes(ingredients)
        .toPromise();
      this._recipes.set(recipes || []);
    } catch (error) {
      this._error.set('Failed to fetch recipes');
      console.error('Recipe fetch error:', error);
    } finally {
      this._isLoading.set(false);
    }
  }

  reset(): void {
    this._prominentColors.set([]);
    this._matchedIngredients.set([]);
    this._recipes.set([]);
    this._isLoading.set(false);
    this._error.set(null);
  }

  // Private methods
  private fetchIngredientsForColors(colors: string[]): void {
    this._isLoading.set(true);
    this._error.set(null);

    const colorQueries = colors.map((color, index) =>
      this.flavorService.queryFoodByColor(color, Math.min(5, index + 1))
    );

    forkJoin(colorQueries)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (allIngredients) => {
          const combinedIngredients = new Set<string>();

          allIngredients.forEach((ingredients, colorIndex) => {
            ingredients.forEach((ingredient) => {
              if (combinedIngredients.size < (colorIndex + 1) * 2) {
                combinedIngredients.add(ingredient);
              }
            });
          });

          this._matchedIngredients.set(Array.from(combinedIngredients));
          this._isLoading.set(false);
        },
        error: (error) => {
          this._error.set('Failed to match ingredients');
          this._isLoading.set(false);
          console.error('Ingredient fetch error:', error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
