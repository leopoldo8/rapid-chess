import { IBoardCoords, TBoardColumn, TBoardRow } from "../../domain/models/BoardCoords.model";
import { IBoardUseCase, IBoardUseCaseAddPieceToArgs } from "../../domain/usecases/IBoard.usecase";
import { EPiecesType, TPieceColor } from "../../domain/models/PiecesType";
import PieceManager from "../PieceManager";

class Board implements IBoardUseCase {
  constructor(
    private readonly boardId: string
  ) {}

  readonly checkClass = '--check';

  get boardElement() {
    if (document) {
      return document.getElementById(this.boardId);
    }
  }

  setCheck(color: TPieceColor) {
    const piece = PieceManager.getPiece({ type: EPiecesType.king, color });

    const tableCell = this.getTableCellFromCoords(piece.boardPosition);

    tableCell.classList.add(this.checkClass);
  }

  removeCheck() {
    const checked = this.boardElement.querySelector(`.${this.checkClass}`);

    if (checked)
      checked.classList.remove(this.checkClass);
  }

  getPieceFromCoords(coords: IBoardCoords): HTMLDivElement {
    const cell = this.getTableCellFromCoords(coords);

    return cell.querySelector('[data-is-piece]');
  }

  addPieceTo({ el, coords }: IBoardUseCaseAddPieceToArgs) {
    const cell = this.getTableCellFromCoords(coords);

    cell.appendChild(el);
  }

  getCoordsFromTableCell(el: HTMLElement | Element): IBoardCoords {
    const column = el.getAttribute('data-column') as TBoardColumn;

    if (!column) {
      throw new Error(`Column not found. The specified element have no data-column attribute.`);
    }

    const row = Number(el.parentElement.getAttribute('data-row')) as TBoardRow;

    if (!row) {
      throw new Error(`Row not found. The specified element have no parent element within an id.`);
    }

    return {
      x: column,
      y: row
    }
  }

  getTableCellFromCoords(coords: IBoardCoords) {
    const row = this.boardElement.querySelector(`[data-row="${coords.y}"]`);

    if (!row) {
      throw new Error(`Row not found. Verify the coordinates received (${JSON.stringify(coords)})`);
    }

    const cell = row.querySelector(`[data-column="${coords.x}"]`) as HTMLElement;

    if (!cell) {
      throw new Error(`Cell not found. Verify the coordinates received (${JSON.stringify(coords)})`);
    }

    return cell;
  }
}

export default Board;
