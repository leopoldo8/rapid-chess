import { IBoardCoords } from "../models/BoardCoords.model";
import { TPieceColor } from "../models/PiecesType";

export interface IBoardUseCaseAddPieceToArgs {
  el: HTMLElement;
  coords: IBoardCoords;
}

export interface IBoardUseCase {
  /**
   * Appends a child element to the desired coordinates.
   */
  addPieceTo: (args: IBoardUseCaseAddPieceToArgs) => void;
  /**
   * Returns the coordinates in the chessboard of the desired table cell.
   */
  getCoordsFromTableCell(element: HTMLElement): IBoardCoords;

  
  getPieceFromCoords(coords: IBoardCoords): HTMLDivElement | null;

  setCheck(color: TPieceColor): void;

  removeCheck(): void;
}
