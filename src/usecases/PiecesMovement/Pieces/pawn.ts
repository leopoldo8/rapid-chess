import { IPieceMovementProps, TPieceMovement } from "../../../domain/usecases/IPiecesMovement.usecase";
import PiecesMovement from "../boardRelative";

export const PawnMovement = (props: IPieceMovementProps): TPieceMovement => {
  const boardRelative = new PiecesMovement(props.position, props.color);

  const movement = {
    top: [],
    topLeft: [],
    topRight: []
  };

  if (props.isTakingAPiece) {
    movement.topLeft.push(boardRelative.Diagonal('left', 'top')(1));
    movement.topRight.push(boardRelative.Diagonal('right', 'top')(1));
  } else {
    movement.top.push(boardRelative.Up(1));

    if (props.moveCount === 0) {
      movement.top.push(boardRelative.Up(2));
    }
  }

  return movement;
}
