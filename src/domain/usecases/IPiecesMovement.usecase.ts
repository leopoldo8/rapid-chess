import Piece from "../../usecases/Piece";
import { IBoardCoords } from "../models/BoardCoords.model";
import { PieceProps, TPieceColor } from "../models/PiecesType";
import { TFieldOfView } from "./IPieceFieldOfView.usecase";

export interface IPieceMovementProps {
  moveCount: number;
  isTakingAPiece: boolean;
  color: TPieceColor;
  position: IBoardCoords;
}

export interface IPiecePosition {
  piece: PieceProps;
  position: IBoardCoords;
}

export interface IVerifyPinResult {
  direction: TFieldOfView;
  piece: Piece;
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
