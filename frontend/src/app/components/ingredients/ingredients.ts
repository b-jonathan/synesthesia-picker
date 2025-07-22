import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AppStateService } from '../../services/state';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ingredients',
  imports: [AsyncPipe],
  templateUrl: './ingredients.html',
  styleUrl: './ingredients.css',
})
export class Ingredients {
  private destroy$ = new Subject<void>();

  state = inject(AppStateService);
  recipeService = inject(RecipeService);

  matchedIngredients$ = this.state.matchedIngredients$;
  recipes$ = this.state.recipes$;

  onGetRecipes() {
    this.state.setRecipes([]);

    const currentIngredients = this.state.getCurrentState().matchedIngredients;

    if (currentIngredients && currentIngredients.length > 0) {
      this.recipeService
        .fetchRecipes(currentIngredients)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (recipes) => {
            this.state.setRecipes(recipes);
            console.log(recipes);
          },
          error: (error) => {
            console.log('Failed to fetch recipes: ' + error.message);
          },
        });
    } else {
      console.log('No ingredients matched.');
    }
  }
}
