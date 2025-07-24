import { Component, input } from '@angular/core';

@Component({
  selector: 'app-color-block',
  imports: [],
  templateUrl: './color-block.html',
})
export class ColorBlock {
  color = input.required<string>();
}
