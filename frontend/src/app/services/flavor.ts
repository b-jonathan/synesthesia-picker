import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonService } from './json';
import { Food } from '../types';

@Injectable({ providedIn: 'root' })
export class FlavorService {
  jsonService = inject(JsonService);

  /**
   * Converts a hex color string to an RGB array.
   * @param hex The hex color string, INCLUDING the hashtag (e.g., '#ff0000').
   * @returns An array containing the RGB values.
   */
  hexToRGB(hex: string): Array<number> {
    const bigint = parseInt(hex.slice(1), 16);

    return [
      (bigint >> 16) & 255, // Red
      (bigint >> 8) & 255, // Green
      bigint & 255, // Blue
    ];
  }

  /**
   * Retrieves the flavor vector for a given color.
   * @param color The hex color to query (e.g., '#ff0000').
   * @returns An Observable of the flavor vector for the specified color.
   */
  // queryFoodByColor(color: string): Observable<Food> {
  //   const [r, g, b] = this.hexToRGB(color);

  //   this.jsonService.getColorVectors().subscribe((colorVectors) => {});
  // }
}
