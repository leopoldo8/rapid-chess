export enum EPiecesType {
  pawn = 'pawn',
  bishop = 'bishop',
  knight = 'knight',
  rook = 'rook',
  queen = 'queen',
  king = 'king'
}

export type TPieceColor = 'light' | 'dark';

export interface PieceProps {
  type: EPiecesType;
  color: TPieceColor
}

export class PieceInstance implements PieceProps {
  constructor(type: EPiecesType, color: TPieceColor) {
    this.type = type;
    this.color = color;
  }

  type: EPiecesType;
  color: TPieceColor
}
