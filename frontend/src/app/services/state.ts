import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export interface Ingredient {
  id: number;
  aisle: string;
  amount: number;
  image: string;
  meta: string[];
  name: string;
  original: string;
  originalName: string;
  unit: string;
  unitLong: string;
  unitShort: string;
}

export interface Recipe {
  id: number;
  image: string;
  imageType: string;
  likes: number;
  missedIngredientCount: number;
  missedIngredients: Ingredient[];
  title: string;
  usedIngredientCount: number;
  usedIngredients: Ingredient[];
  unusedIngredients: Ingredient[];
}

export interface AppState {
  selectedColor: string | null;
  matchedIngredients: string[];
  recipes: Recipe[];
}

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private initialState: AppState = {
    selectedColor: null,
    matchedIngredients: [],
    recipes: [],
  };

  private stateSubject = new BehaviorSubject<AppState>(this.initialState);

  // Public state observable
  public state$ = this.stateSubject.asObservable();

  // Specific state selectors
  public selectedColor$ = this.state$.pipe(
    map((state) => state.selectedColor),
    distinctUntilChanged()
  );

  public matchedIngredients$ = this.state$.pipe(
    map((state) => state.matchedIngredients),
    distinctUntilChanged()
  );

  public recipes$ = this.state$.pipe(
    map((state) => state.recipes),
    distinctUntilChanged()
  );

  // State update methods
  setSelectedColor(color: string): void {
    this.updateState({ selectedColor: color });
  }

  setMatchedIngredients(ingredients: string[]): void {
    this.updateState({ matchedIngredients: ingredients });
  }

  setRecipes(recipes: Recipe[]): void {
    this.updateState({ recipes });
  }

  reset(): void {
    this.stateSubject.next(this.initialState);
  }

  private updateState(partialState: Partial<AppState>): void {
    const currentState = this.stateSubject.value;
    const newState = { ...currentState, ...partialState };
    this.stateSubject.next(newState);
  }

  getCurrentState(): AppState {
    return this.stateSubject.value;
  }
}
