import { Component, input, output } from '@angular/core';
import { ColorPickerChangeEvent, ColorPickerModule } from 'primeng/colorpicker';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-color-picker',
  imports: [ColorPickerModule, FormsModule, CommonModule],
  templateUrl: './color-picker.html',
})
export class ColorPicker {
  // Inputs
  selectedColor = input<string | null>(null);

  // Outputs
  colorChange = output<string>();

  currentColor = '#ffffff';

  onColorChange(event: ColorPickerChangeEvent) {
    const color = event.value as string;
    this.colorChange.emit(color);
    this.currentColor = color;
  }
}
