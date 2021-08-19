import { IPieceMovementProps, TPieceMovement } from "../../../domain/usecases/IPiecesMovement.usecase";
import PiecesMovement from "../boardRelative";

export const RookMovement = (props: IPieceMovementProps): TPieceMovement => {
  const boardRelative = new PiecesMovement(props.position, props.color);

  const movement = {
    top: boardRelative.SequenceOfMovement(boardRelative.Up, 8),
    bottom: boardRelative.SequenceOfMovement(boardRelative.Down, 8),
    left: boardRelative.SequenceOfMovement(boardRelative.Left, 8),
    right: boardRelative.SequenceOfMovement(boardRelative.Right, 8),
  };

  return movement;
}
