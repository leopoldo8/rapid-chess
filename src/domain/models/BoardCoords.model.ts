export type TBoardColumn = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type TBoardRow = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface IBoardCoords {
  x: TBoardColumn;
  y: TBoardRow;
}
