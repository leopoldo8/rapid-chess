import { TPieceColor } from "../domain/models/PiecesType";

const togglePiece = (color: TPieceColor): TPieceColor => {
  if (color === 'light')
    return 'dark';

  return 'light';
}

export default togglePiece;
