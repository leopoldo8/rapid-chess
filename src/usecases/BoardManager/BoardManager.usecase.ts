import { IBoardManagerUseCase, IBoardManagerUseCaseState, IBoardUseCaseAddPieceToArgs, IBoardUseCaseAddPieceToIfPossibleArgs, IBoardUseCaseCanMovePieceResult } from "../../domain/usecases/IBoardManager.usecase";
import { IBoardUseCase } from "../../domain/usecases/IBoard.usecase";
import { EPiecesType } from "../../domain/models/PiecesType";
import { IBoardCoords } from "../../domain/models/BoardCoords.model";
import PieceManager from "../PieceManager";
import PieceMovement from "../PiecesMovement";
import togglePiece from "../../utils/togglePieceColor";
import compareCoords from "../../utils/compareCoords";

class BoardManager implements IBoardManagerUseCase {
  constructor(
    private readonly board: IBoardUseCase
  ) {
    this.bindEvents();
  }

  state: IBoardManagerUseCaseState = {
    check: null,
    turn: 'light'
  }

  private bindEvents() {
    this.state = new Proxy(this.state, {
      set: (target, key, value) => {
        target[key] = value;
        this.onStateChange(target);
        return true;
      }
    })
  }

  private onStateChange(newState: typeof this.state) {
    if (newState.check && newState.check.checked) {
      this.board.setCheck(newState.check.checked.boardPosition);
    } else {
      this.board.removeCheck();
    }
  }

  movePieceIfPossible(props: IBoardUseCaseAddPieceToIfPossibleArgs): Promise<void> {
    return new Promise((resolve, reject) => {
      const canMoveResult = this.canPieceMove(props);
  
      if (!canMoveResult.canMove) {
        return reject(`The ${canMoveResult.reason} verification(s) failed.`);
      }

      const pieceToBeTaken = this.board.getPieceFromCoords(props.to);

      if (pieceToBeTaken) {
        this.takePiece(pieceToBeTaken);
      }

      this.movePiece({
        piece: props.piece.element,
        to: props.to
      });

      this.verifyForChecks();

      this.passTurn();

      resolve();
    });
  }

  verifyForChecks() {
    this.state.check = PieceMovement.getCheckState(this.state.turn);
  }
 
  canPieceMove(props: IBoardUseCaseAddPieceToIfPossibleArgs): IBoardUseCaseCanMovePieceResult {
    let canMove = true;
    let reason = [];

    const verifications = [
      this.isPieceColorTurn,
      this.canPieceMoveIfIsCheck,
      this.canTakePieceAt,
      this.canKingMoveIfEnterCheck,
      this.canMoveIfPieceIsPinned
    ];
    
    verifications.forEach(verification => {
      const verificationResult = verification.bind(this)(props);
      if (!verificationResult) reason.push(verification.name);
      canMove = canMove && verificationResult;
    });

    return {
      canMove,
      reason
    };
  }

  isPieceColorTurn({ piece }: IBoardUseCaseAddPieceToIfPossibleArgs): boolean {
    return piece.color === this.state.turn;
  }

  canPieceMoveIfIsCheck({ piece, to }: IBoardUseCaseAddPieceToIfPossibleArgs): boolean {
    const { check } = this.state;

    if (check) {
      /**
       * If the player is in check, just let the movement
       * happen if the king moves out of all checks or
       * a piece protects it.
       */

      return check.checkers.every(checker => {
        const equalSomeMovement = checker.movements.some(movement => compareCoords(movement, to));

        if (piece.type === EPiecesType.king) {
          /**
           * If the king tries to capture
           * the checkers, then let it pass
           * to the next verification
           */

          if (compareCoords(to, checker.piece.boardPosition)) {
            return true;
          }

          /**
           * If there is no equal movements,
           * so the king could escape from the check
           */
          return !equalSomeMovement;
        }

        /**
         * If there is equal movements to the checking movement,
         * and the piece moved is not the king,
         * then the piece is protecting the king from the check
         */

        const equalCheckingMovement = checker.checkingMovement.some(movement => compareCoords(movement, to));

        if (equalCheckingMovement && checker.piece.type !== EPiecesType.knight) {
          return checker.movements.some(movement => PieceMovement.movementContinuesOnDirection(movement, checker.direction));
        }

        /**
         * If there is no equal movements,
         * the only possible option is to
         * take the checker
         */

        return compareCoords(checker.piece.boardPosition, to);
      });
    }

    /**
     * If it isn't a check,
     * let it pass to the next verification
     */
    return true;
  }

  canMoveIfPieceIsPinned({ piece, to }: IBoardUseCaseAddPieceToIfPossibleArgs): boolean {
    const pieceData = PieceManager.getPiece(piece.element);
    const pinResult = PieceMovement.verifyPin(pieceData);

    if (pinResult) {
      /**
       * If piece is pinned, just let the movement
       * happen if the pin continues or
       * if it takes the piece who is pinning.
       */
      const { direction: pinDirection, piece: pinningPiece } = pinResult;

      return (
        PieceMovement.movementContinuesOnDirection(to, pinDirection)
        || compareCoords(to, pinningPiece.boardPosition)
      )
    }

    /**
     * If it isn't a pin,
     * let the piece move
     */
    return true;
  }
  
  canTakePieceAt({ piece, to }: IBoardUseCaseAddPieceToIfPossibleArgs): boolean {
    const element = this.board.getPieceFromCoords(to);
    const pieceFromSquare = PieceManager.getPiece(element);

    if (pieceFromSquare) {
      /**
       * If has a piece in the square, then it should be a different color to be taken.
       */
      if (pieceFromSquare.color === piece.color) {
        return false;
      }
    }

    return true;
  }

  canKingMoveIfEnterCheck({ piece, to }: IBoardUseCaseAddPieceToIfPossibleArgs): boolean {
    if (piece.type === EPiecesType.king) {
      const pieceData = PieceManager.getPiece(piece.element);

      const firstPlace = pieceData.boardPosition;

      const pieceToBeTaken = this.board.getPieceFromCoords(to);

      if (pieceToBeTaken) {
        pieceToBeTaken.remove();
      }
      
      this.movePiece({
        piece: piece.element,
        to
      });

      const itWouldBeCheck = PieceMovement.getCheckState(togglePiece(this.state.turn));

      if (pieceToBeTaken) {
        this.movePiece({
          piece: pieceToBeTaken,
          to
        });
      }

      this.movePiece({
        piece: piece.element,
        to: firstPlace
      });

      return !itWouldBeCheck;
    }

    return true;
  }

  takePiece(piece: HTMLDivElement) {
    PieceManager.removePiece(piece);
  }

  wouldBeTakenAPiece(coords: IBoardCoords): boolean {
    return !!this.board.getPieceFromCoords(coords);
  }

  passTurn() {
    const newTurn = togglePiece(this.state.turn);

    this.state.turn = newTurn;
  }

  movePiece({ piece, to }: IBoardUseCaseAddPieceToArgs) {
    piece.remove();

    this.board.addPieceTo({
      el: piece,
      coords: to,
    });
  }
}

export default BoardManager;
