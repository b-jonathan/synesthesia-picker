import { Injectable, signal, computed, inject } from '@angular/core';
import { FlavorService } from './flavor';
import { RecipeService } from './recipe';
import { Subject, takeUntil } from 'rxjs';
import { Recipe } from '../types';

@Injectable()
export class ColorPickerStateService {
  private destroy$ = new Subject<void>();
  private flavorService = inject(FlavorService);
  private recipeService = inject(RecipeService);

  // Core state signals
  private _selectedColor = signal<string | null>(null);
  private _matchedIngredients = signal<string[]>([]);
  private _recipes = signal<Recipe[]>([]);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly selectedColor = this._selectedColor.asReadonly();
  readonly matchedIngredients = this._matchedIngredients.asReadonly();
  readonly recipes = this._recipes.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Public actions
  setSelectedColor(color: string): void {
    this._selectedColor.set(color);
    this._error.set(null);
    this.fetchIngredientsForColor(color);
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
    this._selectedColor.set(null);
    this._matchedIngredients.set([]);
    this._recipes.set([]);
    this._isLoading.set(false);
    this._error.set(null);
  }

  // Private methods
  private fetchIngredientsForColor(color: string): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.flavorService
      .queryFoodByColor(color, 3)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (ingredients) => {
          this._matchedIngredients.set(ingredients);
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
