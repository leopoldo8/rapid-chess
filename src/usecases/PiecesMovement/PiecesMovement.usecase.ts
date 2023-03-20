import { IPieceMovementProps, IVerifyPinResult, TGetPieceMovement, TPieceMovement, TPieceSingleMovement } from "../../domain/usecases/IPiecesMovement.usecase";
import { EPiecesType, TPieceColor } from "../../domain/models/PiecesType";

import { PawnMovement } from "./Pieces/pawn";
import { KnightMovement } from "./Pieces/knight";
import { BishopMovement } from "./Pieces/bishop";
import { RookMovement } from "./Pieces/rook";
import { QueenMovement } from "./Pieces/queen";
import { KingMovement } from "./Pieces/king";
import { IBoardCoords } from "../../domain/models/BoardCoords.model";

import PieceFieldOfView from "../PieceFieldOfView/PieceFieldOfView.usecase";
import PieceManager from "../PieceManager";
import togglePiece from "../../utils/togglePieceColor";
import Piece from "../Piece";
import { IBoardManagerCheck, IBoardManagerFindInFOV } from "../../domain/usecases/IBoardManager.usecase";
import { TFieldOfView } from "../../domain/usecases/IPieceFieldOfView.usecase";
import compareCoords from "../../utils/compareCoords";

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

  getCheckState(turn: TPieceColor): IBoardManagerCheck {
    const oppositeKing = PieceManager.getPiece({ type: EPiecesType.king, color: togglePiece(turn) });
    const piecesWithTheColorTurn = PieceManager.piecesArray.filter(piece => piece.color === turn);
    const findResult = this.findPieceAsFirstInSelectsFOV(oppositeKing, piecesWithTheColorTurn);

    if (findResult) {
      return {
        checkers: findResult.pieces,
        checked: findResult.pieceSearched
      }
    }

    return null;
  }

  getPossibleMovementsByPieceType(type: EPiecesType, props: IPieceMovementProps): TPieceSingleMovement {
    this.fieldOfView = new PieceFieldOfView();
    const movement = this.movements[type](props);

    const resultantMovements = Object.keys(movement).map(key => {
      const movements: IBoardCoords[] = movement[key];
      const possibleMovements = this.sanitizeMovementResult(movements, props);

      return this.fieldOfView.applyPieceFOVOnMovements(possibleMovements, key, props);
    }) as TPieceMovement;

    return this.flattenPieceMovement(resultantMovements);
  }

  updateFieldOfView(piece: Piece) {
    return this.getPossibleMovementsByPieceType(piece.type, {
      moveCount: piece.moveCount,
      isTakingAPiece: true,
      color: piece.color,
      position: piece.boardPosition
    });
  }

  movementContinuesOnDirection(to: IBoardCoords, direction: TFieldOfView) {
    return direction.some((fieldOfViewItem) => compareCoords(fieldOfViewItem.position, to));
  }

  verifyPin(targetPiece: Piece): IVerifyPinResult | null {
    let result = null;

    PieceManager.piecesArray
      .filter(piece => piece.color !== targetPiece.color)
      .forEach((piece) => {
        this.updateFieldOfView(piece);

        const targetPieceFindResult = this.fieldOfView.findPieceInFOV(targetPiece.id);

        const { id } = PieceManager.getPiece({
          type: EPiecesType.king,
          color: targetPiece.color
        });

        const targetKingFindResult = this.fieldOfView.findPieceInFOV(id);

        if (
          targetPieceFindResult && targetPieceFindResult.index === 0
          && targetKingFindResult && targetKingFindResult.index === 1
          && targetPieceFindResult.direction === targetKingFindResult.direction
        ) {
          result = {
            direction: this.fieldOfView.fieldOfView.get(targetPieceFindResult.direction),
            piece
          };
        }
      });

    return result;
  }

  findPieceAsFirstInSelectsFOV(pieceSearched: Piece, piecesToVerify: Piece[] = PieceManager.piecesArray): IBoardManagerFindInFOV | null {
    const getFindPieceResult = (piece: Piece) => {
      if (!piece.element.parentElement) {
        return {
          piece,
          resultFind: null
        };
      }

      this.updateFieldOfView(piece);

      const resultFind = this.fieldOfView.findPieceInFOV(pieceSearched.id);

      return {
        piece,
        resultFind
      };
    }

    const pieces = piecesToVerify
      .map(getFindPieceResult)
      .filter(({ piece, resultFind }) => resultFind && (resultFind.index === 0 || piece.type === EPiecesType.knight))
      .map(({ piece, resultFind }) => {
        this.updateFieldOfView(piece);

        const movements = this.movements[piece.type](piece.defaultMovementProps);
      
        return {
          piece,
          checkingMovement: this.sanitizeMovementResult(this.flattenPieceMovement(movements[resultFind.direction]), piece.defaultMovementProps),
          movements: this.sanitizeMovementResult(this.flattenPieceMovement(movements), piece.defaultMovementProps),
          direction: resultFind ? this.fieldOfView.fieldOfView.get(resultFind.direction) : null
        };
      });

    if (pieces.length) {
      return {
        pieceSearched,
        pieces
      };
    }

    return null;
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

  private flattenPieceMovement(movements: TPieceMovement, flatArray: boolean = true): TPieceSingleMovement {
    const arr = Object.keys(movements).map(key => movements[key]);

    if (flatArray) {
      return arr.flat();
    }

    return arr;
  }
}

export default PieceMovement;
