import { Injectable, inject } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { JsonService } from './json';

@Injectable({ providedIn: 'root' })
export class FlavorService {
  jsonService = inject(JsonService);

  /**
   * Retrieves the top N closest flavor vectors for a given color.
   * @param color The hex color to query (e.g., '#ff0000').
   * @param n The number of closest ingredients to return (default: 1).
   * @returns An Observable of an array containing the top N closest ingredient names.
   */
  queryFoodByColor(color: string, n: number = 1): Observable<string[]> {
    const [r, g, b] = this.hexToRGB(color);

    return this.jsonService.getColorVectors().pipe(
      switchMap((colorVectors) => {
        const newRed = colorVectors.red.map((x) => (x * r) / 255);
        const newGreen = colorVectors.green.map((x) => (x * g) / 255);
        const newBlue = colorVectors.blue.map((x) => (x * b) / 255);

        const newRGB = newRed.map((x, i) => x + newGreen[i] + newBlue[i]);

        // Find top N closest flavor vectors
        return this.jsonService.getFoodVectors().pipe(
          map((foodVectors) => {
            const distances = Object.keys(foodVectors).map((key) => {
              const flavorVector = foodVectors[key];
              const distance = this.euclideanDistance(newRGB, flavorVector);
              return { key, distance };
            });

            // Sort by distance (ascending) and take top N
            const topN = distances
              .sort((a, b) => a.distance - b.distance)
              .slice(0, n)
              .map((item) => item.key);

            return topN;
          })
        );
      })
    );
  }

  private softmax(arr: Array<number>): Array<number> {
    const max = Math.max(...arr);
    const expArr = arr.map((x) => Math.exp(x - max));
    const sum = expArr.reduce((a, b) => a + b, 0);

    return expArr.map((x) => x / sum);
  }

  private normalize(vector: Array<number>): Array<number> {
    const min = Math.min(...vector);
    const max = Math.max(...vector);
    const range = max - min;

    return vector.map((val) => (range === 0 ? 0 : (val - min) / range));
  }

  private cosineSimilarity(
    vectorA: Array<number>,
    vectorB: Array<number>
  ): number {
    const dotProduct = vectorA.reduce(
      (sum, value, index) => sum + value * vectorB[index],
      0
    );

    const magnitudeA = Math.sqrt(
      vectorA.reduce((sum, value) => sum + value * value, 0)
    );

    const magnitudeB = Math.sqrt(
      vectorB.reduce((sum, value) => sum + value * value, 0)
    );

    return magnitudeA === 0 || magnitudeB === 0
      ? 0
      : dotProduct / (magnitudeA * magnitudeB);
  }

  private euclideanDistance(
    vectorA: Array<number>,
    vectorB: Array<number>
  ): number {
    return Math.sqrt(
      vectorA.reduce(
        (sum, value, index) => sum + Math.pow(value - vectorB[index], 2),
        0
      )
    );
  }

  /**
   * Converts a hex color string to an RGB array.
   * @param hex The hex color string, INCLUDING the hashtag (e.g., '#ff0000').
   * @returns An array containing the RGB values.
   */
  private hexToRGB(hex: string): Array<number> {
    const bigint = parseInt(hex.slice(1), 16);

    return [
      (bigint >> 16) & 255, // Red
      (bigint >> 8) & 255, // Green
      bigint & 255, // Blue
    ];
  }
}
