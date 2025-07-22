export const flavors = ['sweet', 'sour', 'bitter', 'umami', 'salty'];

export type Color = {
  red: number[];
  green: number[];
  blue: number[];
};

export type Food = {
  [key: string]: number[];
};
