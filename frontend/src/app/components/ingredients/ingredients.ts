import { Component, inject } from '@angular/core';
import { AppStateService } from '../../services/state';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-ingredients',
  imports: [AsyncPipe],
  templateUrl: './ingredients.html',
  styleUrl: './ingredients.css',
})
export class Ingredients {
  state = inject(AppStateService);

  matchedIngredients$ = this.state.matchedIngredients$;
}
