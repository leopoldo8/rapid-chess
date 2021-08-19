import { IPieceMovementProps, TPieceMovement } from "../../../domain/usecases/IPiecesMovement.usecase";
import PiecesMovement from "../boardRelative";

export const QueenMovement = (props: IPieceMovementProps): TPieceMovement => {
  const boardRelative = new PiecesMovement(props.position, props.color);

  const movement = {
    topLeft: boardRelative.SequenceOfMovement(boardRelative.Diagonal('left', 'top'), 8),
    bottomLeft: boardRelative.SequenceOfMovement(boardRelative.Diagonal('left', 'bottom'), 8),
    topRight: boardRelative.SequenceOfMovement(boardRelative.Diagonal('right', 'top'), 8),
    bottomRight: boardRelative.SequenceOfMovement(boardRelative.Diagonal('right', 'bottom'), 8),
    top: boardRelative.SequenceOfMovement(boardRelative.Up, 8),
    bottom: boardRelative.SequenceOfMovement(boardRelative.Down, 8),
    left: boardRelative.SequenceOfMovement(boardRelative.Left, 8),
    right: boardRelative.SequenceOfMovement(boardRelative.Right, 8),
  }

  return movement;
}
