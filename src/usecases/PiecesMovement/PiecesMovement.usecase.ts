import { IPieceMovementProps, IVerifyForCheck, TGetPieceMovement, TPieceMovement, TPieceSingleMovement } from "../../domain/usecases/IPiecesMovement.usecase";
import { EPiecesType, TPieceColor } from "../../domain/models/PiecesType";

import { PawnMovement } from "./Pieces/pawn";
import { KnightMovement } from "./Pieces/knight";
import { BishopMovement } from "./Pieces/bishop";
import { RookMovement } from "./Pieces/rook";
import { QueenMovement } from "./Pieces/queen";
import { KingMovement } from "./Pieces/king";
import { IBoardCoords } from "../../domain/models/BoardCoords.model";

import PieceFieldOfView from "../PieceFieldOfView";
import BoardManager from "../BoardManager";

class PieceMovement {
  fieldOfView = new PieceFieldOfView();

  movements: Record<EPiecesType, TGetPieceMovement> = {
    [EPiecesType.pawn]: PawnMovement,
    [EPiecesType.knight]: KnightMovement,
    [EPiecesType.bishop]: BishopMovement,
    [EPiecesType.rook]: RookMovement,
    [EPiecesType.queen]: QueenMovement,
    [EPiecesType.king]: KingMovement
  }

  getPossibleMovementsByPieceType(type: EPiecesType, props: IPieceMovementProps): TPieceSingleMovement {
    this.fieldOfView = new PieceFieldOfView();
    const movement = this.movements[type](props);

    const resultantMovements = Object.keys(movement).map(key => {
      const movements: IBoardCoords[] = movement[key];
      const possibleMovements = this.sanitizeMovementResult(movements, props);
      
      if (key !== 'outOfFieldOfView') {
        return this.fieldOfView.applyPieceFOVOnMovements(possibleMovements, key, props);
      }

      return possibleMovements;
    }) as TPieceMovement;

    return this.flattenPieceMovement(resultantMovements);
  }

  verifyForCheck(type: EPiecesType, props: IVerifyForCheck) {
    const otherKing = {
      type: EPiecesType.king,
      color: props.color === 'light' ? 'dark' : 'light' as TPieceColor
    }

    this.getPossibleMovementsByPieceType(type, {
      moveCount: 0,
      isTakingAPiece: true,
      ...props
    });

    return this.fieldOfView.hasPieceInFOV(otherKing);
  }

  private sanitizeMovementResult(movements: TPieceSingleMovement, props: IPieceMovementProps): TPieceSingleMovement {
    return movements.filter((movement, index) => (
      movement.x
      && movement.y
      && movement.y <= 8
      && movement.y >= 0
      && (movement.x !== props.position.x || movement.y !== props.position.y)
      && movements.findIndex(fm => fm.x === movement.x && fm.y === movement.y) === index
    ));
  }

  private flattenPieceMovement(movements: TPieceMovement): TPieceSingleMovement {
    return Object.keys(movements).map(key => movements[key]).flat();
  }
}

export default PieceMovement;
