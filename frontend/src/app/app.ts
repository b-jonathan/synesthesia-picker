import { Component, inject, OnInit } from '@angular/core';
import { JsonService } from '././services/json';
import { CommonModule, JsonPipe } from '@angular/common';
import { Color, Food } from './types';

@Component({
  selector: 'app-root',
  imports: [CommonModule, JsonPipe],
  templateUrl: './app.html',
})
export class App implements OnInit {
  flavorService = inject(JsonService);

  colorVectors: Color | null = null;
  colors: [string, number[]][] = [];
  foodVectors: Food | null = null;

  ngOnInit(): void {
    this.flavorService.getColorVectors().subscribe((data) => {
      this.colorVectors = data;
      this.colors = Object.entries(this.colorVectors);
      console.log('Color Vectors: ' + this.colorVectors);
    });

    this.flavorService.getFoodVectors().subscribe((data) => {
      this.foodVectors = data;
      console.log('Color Vectors: ' + this.colorVectors);
    });
  }
}
