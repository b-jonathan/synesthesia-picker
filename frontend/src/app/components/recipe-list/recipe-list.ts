import { Component, inject } from '@angular/core';
import { AppStateService } from '../../services/state';
import { AsyncPipe } from '@angular/common';
import { RecipeCard } from '../recipe-card/recipe-card';

@Component({
  selector: 'app-recipe-list',
  imports: [AsyncPipe, RecipeCard],
  templateUrl: './recipe-list.html',
})
export class RecipeList {
  state = inject(AppStateService);

  recipes$ = this.state.recipes$;
}
