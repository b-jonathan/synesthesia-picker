export const flavors = ['sweet', 'sour', 'bitter', 'umami', 'salty'];

export type Color = {
  red: number[];
  green: number[];
  blue: number[];
};

export type Food = {
  [key: string]: number[];
};

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
