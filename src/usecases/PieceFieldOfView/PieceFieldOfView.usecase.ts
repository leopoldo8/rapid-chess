import { IPieceMovementProps } from "../../domain/usecases/IPiecesMovement.usecase";
import { IFieldOfViewItem, IFindPiece, TFieldOfView } from "../../domain/usecases/IPieceFieldOfView.usecase";
import { IBoardCoords } from "../../domain/models/BoardCoords.model";

import PieceManager from "../PieceManager";
import Board from "../Board";

class PieceFieldOfView {
  fieldOfView = new Map<string, TFieldOfView>();

  applyPieceFOVOnMovements(movements: IBoardCoords[], direction: string, props: IPieceMovementProps) {
    return movements.filter(movement => !this.detectCollisionOnSquare(movement, direction, props));
  }

  private detectCollisionOnSquare(coords: IBoardCoords, direction: string, props: IPieceMovementProps): boolean {
    const element = Board.getPieceFromCoords(coords);
    const piece = PieceManager.getPiece(element);

    const fieldOfViewDirection = this.createOrGetDirectionFromFOV(direction);

    /**
     * Knight edge case
     */
    if (direction === 'outOfFieldOfView') {
      if (piece) {
        this.addItemToFOV(direction, { piece, position: coords });
      }

      return false;
    }

    if (piece) {
      const isSameColor = piece.color === props.color;

      this.addItemToFOV(direction, { piece, position: coords });

      if (isSameColor) {
        /**
         * If the piece has the same color, then
         * the piece should not move any point further
         */
        return true;
      } else {
        /**
         * If the piece has a different same color, then
         * the piece should move only the sufficient to capture it
         */
        return fieldOfViewDirection.length > 1;
      }
    }

    /**
     * If there is no piece, then
     * the piece should be able to move since there
     * wasn't any piece blocking the way before
     */
    return !!fieldOfViewDirection.length;
  }

  private createOrGetDirectionFromFOV(direction: string): TFieldOfView {
    if (this.fieldOfView.has(direction)) {
      return this.fieldOfView.get(direction);
    }

    const initialValue = [];
    this.fieldOfView.set(direction, initialValue);
    return initialValue;
  }

  private addItemToFOV(direction: string, item: IFieldOfViewItem) {
    const fov = this.createOrGetDirectionFromFOV(direction);

    fov.push(item);
    this.fieldOfView.set(direction, fov);
  }

  findPieceInFOV(id: string): null | IFindPiece {
    let result = null;

    this.fieldOfView.forEach((pieces, direction) => {
      const index = pieces.findIndex(({ piece }) => piece.id === id);

      if (index >= 0) {
        result = {
          index,
          direction
        };

        return;
      }
    });

    return result;
  }
}

export default PieceFieldOfView;
