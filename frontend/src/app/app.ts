import { Component, inject, OnInit, signal } from '@angular/core';
import { JsonService } from '././services/json';
import { CommonModule } from '@angular/common';
import { Color, Food } from './types';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FlavorService } from './services/flavor';
import { ColorEvent } from 'ngx-color';
import { ColorPicker } from './components/color-picker/color-picker';
import { Ingredients } from './components/ingredients/ingredients';
import { RecipeList } from './components/recipe-list/recipe-list';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ColorPicker, Ingredients, RecipeList],
  templateUrl: './app.html',
})
export class App {}
