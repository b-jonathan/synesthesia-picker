import { Component, input } from '@angular/core';
import { RecipeCard } from '../recipe-card/recipe-card';
import { Recipe } from '../../types';

@Component({
  selector: 'app-recipe-list',
  imports: [RecipeCard],
  templateUrl: './recipe-list.html',
})
export class RecipeList {
  recipes = input<Recipe[]>([]);
}
