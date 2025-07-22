import { Component, inject } from '@angular/core';
import { AppStateService } from '../../services/state';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-recipe-list',
  imports: [AsyncPipe],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.css',
})
export class RecipeList {
  state = inject(AppStateService);

  recipes$ = this.state.recipes$;
}
