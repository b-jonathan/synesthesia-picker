import { Component, input } from '@angular/core';
import { Recipe } from '../../types';

@Component({
  selector: 'app-recipe-card',
  imports: [],
  templateUrl: './recipe-card.html',
})
export class RecipeCard {
  recipe = input.required<Recipe>();
}
