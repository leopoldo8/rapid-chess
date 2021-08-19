import { IPieceMovementProps, TPieceMovement } from "../../../domain/usecases/IPiecesMovement.usecase";
import PiecesMovement from "../boardRelative";

export const KnightMovement = (props: IPieceMovementProps): TPieceMovement => {
  const boardRelative = new PiecesMovement(props.position, props.color);

  const twiceY = (y: 'top' | 'bottom', x: 'left' | 'right') => {    
    const pos = y === 'top' ? boardRelative.Up(2) : boardRelative.Down(2);

    return x === 'left' ? boardRelative.Left(1, pos) : boardRelative.Right(1, pos);
  }

  const twiceX = (x: 'left' | 'right', y: 'top' | 'bottom') => {    
    const pos = x === 'left' ? boardRelative.Left(2) : boardRelative.Right(2);

    return y === 'top' ? boardRelative.Up(1, pos) : boardRelative.Down(1, pos);
  }

  const movement = {
    outOfFieldOfView: [
      twiceY('top', 'left'),
      twiceY('top', 'right'),
      twiceY('bottom', 'left'),
      twiceY('bottom', 'right'),
      twiceX('left', 'top'),
      twiceX('left', 'bottom'),
      twiceX('right', 'top'),
      twiceX('right', 'bottom'),
    ]
  }

  return movement;
}
