import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Ingredients } from '../../components/ingredients/ingredients';
import { RecipeList } from '../../components/recipe-list/recipe-list';
import { ColorPicker } from '../../components/color-picker/color-picker';
import { AppStateService } from '../../services/state';

@Component({
  selector: 'app-picker',
  imports: [CommonModule, Ingredients, RecipeList, ColorPicker],
  templateUrl: './picker.html',
})
export class Picker {
  state = inject(AppStateService);

  recipes$ = this.state.recipes$;
}
