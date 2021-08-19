import { IPieceMovementProps, TPieceMovement } from "../../../domain/usecases/IPiecesMovement.usecase";
import PiecesMovement from "../boardRelative";

export const KingMovement = (props: IPieceMovementProps): TPieceMovement => {
  const boardRelative = new PiecesMovement(props.position, props.color);

  const movement = {
    topLeft: [boardRelative.Diagonal('left', 'top')(1)],
    bottomLeft: [boardRelative.Diagonal('left', 'bottom')(1)],
    topRight: [boardRelative.Diagonal('right', 'top')(1)],
    bottomRight: [boardRelative.Diagonal('right', 'bottom')(1)],
    top: [boardRelative.Up(1)],
    bottom: [boardRelative.Down(1)],
    left: [boardRelative.Left(1)],
    right: [boardRelative.Right(1)],
  }

  return movement;
}
