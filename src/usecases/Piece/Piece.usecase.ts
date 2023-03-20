import { IBoardCoords, TBoardColumn, TBoardRow } from "../../domain/models/BoardCoords.model";
import { PieceProps } from "../../domain/models/PiecesType";
import { IPieceUseCase } from "../../domain/usecases/IPiece.usecase";

import PieceMovement from "../PiecesMovement";
import BoardManager from "../BoardManager";
import Draggable from "../Draggable";
import Board from "../Board";
import { TPieceSingleMovement } from "../../domain/usecases/IPiecesMovement.usecase";

class Piece extends Draggable implements IPieceUseCase {
  constructor(
    public readonly pieceProps: PieceProps,
    public readonly id: string,
    public element?: HTMLDivElement,
  ) {
    super();
  }

  moveCount: number = 0;

  dropMouseUp(e: React.MouseEvent<HTMLDivElement>): void {
    const { clientX, clientY } = e;

    this.changePiecesPointerEvents('none');

    const dropSquare = document.elementFromPoint(clientX, clientY);
    
    this.changePiecesPointerEvents('auto');

    const coords = Board.getCoordsFromTableCell(dropSquare);

    this.moveToIfPossible(coords);
  }

  async moveToIfPossible(coords: IBoardCoords) {
    if (!this.canMoveTo(coords)) return;

    const piece = {
      ...this.pieceProps,
      element: this.element
    };

    try {
      await BoardManager.movePieceIfPossible({
        piece,
        to: coords
      });

      this.moveCount += 1;
    } catch(e) {
      console.warn('Could not move the piece.', e);
    }
  }

  canMoveTo(coords: IBoardCoords): boolean {
    return (
      this.canMoveByPieceMovement(coords)
    );
  }

  canMoveByPieceMovement(coords: IBoardCoords): boolean {
    const possibleMovements = this.getPossibleMovementsByCoords(coords);

    return possibleMovements.some(movement => (
      movement.x === coords.x
      && movement.y === coords.y
    ));
  }

  getPossibleMovementsByCoords(coords: IBoardCoords): TPieceSingleMovement {
    return PieceMovement.getPossibleMovementsByPieceType(this.type, {
      moveCount: this.moveCount,
      isTakingAPiece: BoardManager.wouldBeTakenAPiece(coords),
      position: this.boardPosition,
      color: this.pieceProps.color
    });
  }

  private changePiecesPointerEvents(value: 'none' | 'auto') {
    const pieces = Board.boardElement.querySelectorAll('[data-is-piece]');
    pieces.forEach((piece: HTMLElement) => piece.style.pointerEvents = value);
  }

  get defaultMovementProps() {
    return {
      moveCount: this.moveCount,
      isTakingAPiece: true,
      color: this.pieceProps.color,
      position: this.boardPosition
    }
  }

  get type() {
    return this.pieceProps.type;
  }

  get color() {
    return this.pieceProps.color;
  }

  get boardPosition(): IBoardCoords {
    const parentCell = this.element.parentElement;
    const parentRow = parentCell.parentElement;
    const x = parentCell.getAttribute('data-column') as TBoardColumn;
    const y = Number(parentRow.getAttribute('data-row')) as TBoardRow;

    return {
      x,
      y
    }
  }
}

export default Piece;
