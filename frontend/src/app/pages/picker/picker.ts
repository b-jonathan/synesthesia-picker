import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Ingredients } from '../../components/ingredients/ingredients';
import { RecipeList } from '../../components/recipe-list/recipe-list';
import { ColorPicker } from '../../components/color-picker/color-picker';

@Component({
  selector: 'app-picker',
  imports: [CommonModule, Ingredients, RecipeList, ColorPicker],
  templateUrl: './picker.html',
})
export class Picker {}
