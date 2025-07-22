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
  ingredients: Ingredient[];
  usedIngredientCount: number;
  usedIngredients: Ingredient[];
  unusedIngredients: Ingredient[];
}

export interface AppState {
  selectedColor: string | null;
  matchedIngredients: string[];
  recipes: Recipe[];
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private initialState: AppState = {
    selectedColor: null,
    matchedIngredients: [],
    recipes: [],
    error: null,
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

  public error$ = this.state$.pipe(
    map((state) => state.error),
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
    this.updateState({ recipes, error: null });
  }

  setError(error: string): void {
    this.updateState({ error });
  }

  clearError(): void {
    this.updateState({ error: null });
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
