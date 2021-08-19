import { IBoardCoords, TBoardColumn, TBoardRow } from "../../domain/models/BoardCoords.model";
import { TPieceColor } from "../../domain/models/PiecesType";
import { ColumnsNames } from "../../constants/board";

class BoardRelative {
  constructor(
    private readonly coords: IBoardCoords,
    private readonly color: TPieceColor
  ) {}

  Up(amountProp: number, overrideCoords?: IBoardCoords): IBoardCoords {
    const { x, y } = overrideCoords || this.coords;
    const amount = this.getRelativeAmountByColor(amountProp);

    const newY = y + amount as TBoardRow;

    return {
      x,
      y: newY
    };
  }

  Left(amountProp: number, overrideCoords?: IBoardCoords): IBoardCoords {
    const { x, y } = overrideCoords || this.coords;

    const newX = this.offsetAmountToXAxis(x, -amountProp);

    return {
      x: newX,
      y
    };
  }

  Right(amountProp: number, overrideCoords?: IBoardCoords): IBoardCoords {
    const { x, y } = overrideCoords || this.coords;

    const newX = this.offsetAmountToXAxis(x, amountProp);

    return {
      x: newX,
      y
    };
  }

  Down(amountProp: number, overrideCoords?: IBoardCoords): IBoardCoords {
    const { x, y } = overrideCoords || this.coords;
    const amount = this.getRelativeAmountByColor(amountProp);

    const newY = y - amount as TBoardRow;

    return {
      x,
      y: newY
    };
  }

  Diagonal(xDir: 'left' | 'right', yDir: 'top' | 'bottom'): (amountProp: number, overrideCoords?: IBoardCoords) => IBoardCoords {
    return (amountProp: number, overrideCoords?: IBoardCoords) => {
      const initialPos = overrideCoords || this.coords;
      
      const pos = yDir === 'top' ? this.Up(amountProp, initialPos) : this.Down(amountProp, initialPos);
  
      return xDir === 'left' ? this.Left(amountProp, pos) : this.Right(amountProp, pos);
    }
  }

  SequenceOfMovement(movement: (amountProp: number, overrideCoords?: IBoardCoords) => IBoardCoords, count: number) {
    return Array.from<unknown[], IBoardCoords>(Array(count), (v, i) => movement.bind(this, i)());
  }

  private offsetAmountToXAxis(x: TBoardColumn, amount: number): TBoardColumn {
    const index = this.getXAxisIndex(x);

    return ColumnsNames[index + amount];
  }

  private getXAxisIndex(x: TBoardColumn): number {
    return ColumnsNames.findIndex(c => c === x);
  }

  private getRelativeAmountByColor(amount: number) {
    if (this.color === 'light') {
      return -amount;
    }

    return amount;
  }
}

export default BoardRelative;
