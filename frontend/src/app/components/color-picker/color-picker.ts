import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ColorPickerChangeEvent, ColorPickerModule } from 'primeng/colorpicker';
import { AppStateService } from '../../services/state';
import { FlavorService } from '../../services/flavor';
import { FormsModule } from '@angular/forms';
import { JsonService } from '../../services/json';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-color-picker',
  imports: [ColorPickerModule, FormsModule, CommonModule],
  templateUrl: './color-picker.html',
})
export class ColorPicker implements OnInit {
  private destroy$ = new Subject<void>();

  state = inject(AppStateService);
  flavorService = inject(FlavorService);
  jsonService = inject(JsonService);

  selectedColor$ = this.state.selectedColor$;
  matchedIngredients$ = this.state.matchedIngredients$;

  currentColor = '#ffffff';

  ngOnInit() {
    this.selectedColor$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((color) => {
          if (color) {
            // Get top N closest ingredients
            return this.flavorService.queryFoodByColor(color, 3);
          }
          return [];
        })
      )
      .subscribe((ingredients) => {
        if (ingredients && ingredients.length > 0) {
          this.state.setMatchedIngredients(ingredients);
        }
      });
  }

  onColorChange(event: ColorPickerChangeEvent) {
    const color = event.value;
    this.state.setSelectedColor(color as string);
    this.currentColor = color as string; // Keep the picker in sync
  }
}
