import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Recipe } from '../types';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  http = inject(HttpClient);

  private API_URL = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${environment.spoonacularApiKey}&ingredients=`;

  /**
   * Fetches recipes based on matched ingredients.
   * @returns An Observable of recipes.
   */
  fetchRecipes(ingredients: string[]): Observable<Recipe[]> {
    const url = `${this.API_URL}${ingredients.join(',')}`;
    return this.http.get<Recipe[]>(url).pipe(
      map((recipes) => {
        return recipes;
      })
    );
  }
}
