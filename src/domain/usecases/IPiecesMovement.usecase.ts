import { IBoardCoords } from "../models/BoardCoords.model";
import { TPieceColor } from "../models/PiecesType";

export interface IPieceMovementProps {
  moveCount: number;
  isTakingAPiece: boolean;
  color: TPieceColor;
  position: IBoardCoords;
}

export interface IVerifyForCheck {
  color: TPieceColor;
  position: IBoardCoords;
}

export type TPieceSingleMovement = IBoardCoords[];

export type TPieceMovement = {
  topLeft?: TPieceSingleMovement;
  top?: TPieceSingleMovement;
  topRight?: TPieceSingleMovement;
  left?: TPieceSingleMovement;
  right?: TPieceSingleMovement;
  bottomLeft?: TPieceSingleMovement;
  bottom?: TPieceSingleMovement;
  bottomRight?: TPieceSingleMovement;
  outOfFieldOfView?: TPieceSingleMovement;
}

export type TGetPieceMovement = (props: IPieceMovementProps) => TPieceMovement;
