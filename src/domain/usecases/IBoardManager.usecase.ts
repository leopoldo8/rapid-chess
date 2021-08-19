import { IBoardCoords } from "../models/BoardCoords.model";
import { PieceProps } from "../models/PiecesType";

export interface IBoardUseCaseAddPieceToIfPossibleArgs {
  piece: PieceProps & { element: HTMLDivElement };
  to: IBoardCoords;
}

export interface IBoardUseCaseAddPieceToArgs {
  piece: HTMLDivElement;
  to: IBoardCoords;
}

export interface IBoardManagerUseCase {
  movePiece: (args: IBoardUseCaseAddPieceToArgs) => void;
}
