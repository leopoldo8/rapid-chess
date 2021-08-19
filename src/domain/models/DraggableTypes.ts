export interface IPosition {
  x: number;
  y: number;
}

export class Position implements IPosition {
  constructor(
    x: number,
    y: number
  ) {
    this.x = x;
    this.y = y;
  }

  x: number;
  y: number;
}
