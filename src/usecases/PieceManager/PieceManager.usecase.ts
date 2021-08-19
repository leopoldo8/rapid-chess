import { v4 as uuidv4 } from 'uuid';
import { PieceProps } from '../../domain/models/PiecesType';

import { IPieceConstructor } from '../../domain/usecases/IPieceManager.usecase';
import Piece from '../Piece';

class PieceManager {
  pieces = new Map<string, Piece>();

  assignNewPiece(props: IPieceConstructor): Piece {
    const id = uuidv4();
    const piece = new Piece(props.pieceProps, id, props.element);

    this.pieces.set(id, piece);
    return piece;
  }

  removePiece(element: HTMLElement): void {
    const id = this.getIdFromElement(element);

    if (id && this.pieces.has(id)) {
      this.pieces.delete(id);
      element.remove();
    }
  }

  getPiece(target: HTMLElement | PieceProps): Piece | null {
    if (target instanceof HTMLElement) {
      const id = this.getIdFromElement(target);
  
      if (id && this.pieces.has(id)) {
        return this.pieces.get(id);
      }
    } else if (target) {
      const valuesIterator = this.pieces.values();
      let result = null;

      let item = valuesIterator.next();
      while (!item.done) {
        const { value }: { value: Piece } = item;

        if (value.color === target.color && value.type === target.type) {
          result = value;
          break;
        }

        item = valuesIterator.next();
      }

      return result;
    }

    return null;
  }

  private getIdFromElement(element: HTMLElement): string {
    return element.getAttribute('data-piece');
  }
}

export default PieceManager;
