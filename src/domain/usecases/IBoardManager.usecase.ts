import Piece from "../../usecases/Piece";
import { IBoardCoords } from "../models/BoardCoords.model";
import { PieceProps, TPieceColor } from "../models/PiecesType";
import { TFieldOfView } from "./IPieceFieldOfView.usecase";
import { TPieceSingleMovement } from "./IPiecesMovement.usecase";

export interface IBoardUseCaseAddPieceToIfPossibleArgs {
  piece: PieceProps & { element: HTMLDivElement };
  to: IBoardCoords;
}

export interface IBoardUseCaseCanMovePieceResult {
  canMove: boolean;
  reason: string[];
}

export interface IBoardUseCaseAddPieceToArgs {
  piece: HTMLDivElement;
  to: IBoardCoords;
}

export interface IBoardManagerUseCase {
  movePiece: (args: IBoardUseCaseAddPieceToArgs) => void;
}

export interface IBoardManagerFindInFOV {
  pieces: {
    piece: Piece,
    checkingMovement: TPieceSingleMovement,
    movements: TPieceSingleMovement,
    direction: TFieldOfView
  }[],
  pieceSearched: Piece
}

export interface IBoardManagerCheck {
  checkers: {
    piece: Piece,
    checkingMovement: TPieceSingleMovement,
    movements: TPieceSingleMovement,
    direction: TFieldOfView
  }[];
  checked: Piece
}

export interface IBoardManagerUseCaseState {
  check: IBoardManagerCheck | null;
  turn: TPieceColor;
}
