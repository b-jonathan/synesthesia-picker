import { Injectable, TransferState, inject, makeStateKey } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Color, Food } from '../types';

const COLOR_VECTORS_KEY = makeStateKey<Color>('color_vectors');
const FOOD_VECTORS_KEY = makeStateKey<Food>('food_vectors');

@Injectable({ providedIn: 'root' })
export class JsonService {
  http = inject(HttpClient);
  state = inject(TransferState);

  getColorVectors(): Observable<Color> {
    const cached = this.state.get(COLOR_VECTORS_KEY, null);
    if (cached) return of(cached);

    return this.http
      .get<Color>('/assets/data/color_vectors.json')
      .pipe(tap((data) => this.state.set(COLOR_VECTORS_KEY, data)));
  }

  getFoodVectors(): Observable<Food> {
    const cached = this.state.get(FOOD_VECTORS_KEY, null);
    if (cached) return of(cached);

    return this.http
      .get<Food>('/assets/data/food_vectors.json')
      .pipe(tap((data) => this.state.set(FOOD_VECTORS_KEY, data)));
  }
}
