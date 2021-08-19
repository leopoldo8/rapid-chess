import { IBoardManagerUseCase, IBoardUseCaseAddPieceToArgs, IBoardUseCaseAddPieceToIfPossibleArgs } from "../../domain/usecases/IBoardManager.usecase";
import { IBoardUseCase } from "../../domain/usecases/IBoard.usecase";
import { EPiecesType, TPieceColor } from "../../domain/models/PiecesType";
import { IBoardCoords } from "../../domain/models/BoardCoords.model";
import PieceManager from "../PieceManager";
import PieceMovement from "../PiecesMovement";
import togglePiece from "../../utils/togglePieceColor";

class BoardManager implements IBoardManagerUseCase {
  constructor(
    private readonly board: IBoardUseCase
  ) {
    this.bindEvents();
  }

  state = {
    isCheck: false,
    turn: 'light' as TPieceColor
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
    if (newState.isCheck) {
      const otherPlayer = togglePiece(newState.turn);
      this.board.setCheck(otherPlayer);
    } else {
      this.board.removeCheck();
    }
  }

  movePieceIfPossible(props: IBoardUseCaseAddPieceToIfPossibleArgs): Promise<void> {
    return new Promise((resolve, reject) => {
      const canMove = this.canPieceMove(props);
  
      if (canMove) {
        const pieceToBeTaken = this.board.getPieceFromCoords(props.to);
  
        if (pieceToBeTaken) {
          this.takePiece(pieceToBeTaken);
        }
  
        this.movePiece({
          piece: props.piece.element,
          to: props.to
        });

        this.state.isCheck = PieceMovement.verifyForCheck(props.piece.type, {
          position: props.to,
          color: props.piece.color
        });

        this.passTurn();

        resolve();
      }

      reject();
    });
  }

  canPieceMove(props: IBoardUseCaseAddPieceToIfPossibleArgs): boolean {
    return (
      this.isHisTurn(props)
      && this.canPieceMoveIfIsCheck(props)
      && this.canTakePieceAt(props)
    );
  }

  isHisTurn({ piece }: IBoardUseCaseAddPieceToIfPossibleArgs): boolean {
    return piece.color === this.state.turn;
  }

  canPieceMoveIfIsCheck({ piece }: IBoardUseCaseAddPieceToIfPossibleArgs): boolean {
    /**
     * If someone is in check, only the king can move.
     */
    return this.state.isCheck ? piece.type === EPiecesType.king : true;
  }

  
  canTakePieceAt({ piece, to }: IBoardUseCaseAddPieceToIfPossibleArgs): boolean {
    const element = this.board.getPieceFromCoords(to);
    const pieceFromSquare = PieceManager.getPiece(element);

    /**
     * If has a piece in the square, then it should be a different color to be taken.
     */
    return pieceFromSquare ? pieceFromSquare.color !== piece.color : true;
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
