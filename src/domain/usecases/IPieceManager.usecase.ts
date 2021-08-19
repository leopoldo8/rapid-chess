import { PieceProps } from "../models/PiecesType";

export interface IPieceConstructor {
  pieceProps: PieceProps;
  element?: HTMLDivElement;
}
