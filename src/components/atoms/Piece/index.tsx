import { forwardRef, Ref, useState, useEffect, useImperativeHandle, useRef, useMemo } from 'react';
import { PieceProps } from '../../../domain/models/PiecesType';
import PieceManager from '../../../usecases/PieceManager';

import { PieceElement, PieceIMG } from './style'; 

const Piece = (props: PieceProps, ref: Ref<HTMLDivElement>) => {
  const { type, color } = props;
  const pieceInstance = PieceManager.assignNewPiece({ pieceProps: props });

  const [id, setId] = useState(null);
  const innerRef = useRef<HTMLDivElement>();
  useImperativeHandle(ref, () => innerRef.current);

  useEffect(() => {
    pieceInstance.element = innerRef.current;
    setId(pieceInstance.id);
  }, []);

  const onMouseDown = useMemo(() => (e: React.MouseEvent<HTMLDivElement>) => {
    pieceInstance.dragMouseDown(e);
  }, [pieceInstance.element]);

  const onMouseUpCapture = useMemo(() => (e: React.MouseEvent<HTMLDivElement>) => {
    pieceInstance.dropMouseUp(e);
  }, [pieceInstance.element]);

  return (
    <PieceElement
      ref={innerRef}
      onMouseDown={(e) => onMouseDown(e)}
      onMouseUpCapture={(e) => onMouseUpCapture(e)}
      data-piece={id}
      data-is-piece="true"
    >
      <PieceIMG src={`/${type}-${color}.svg`} />
    </PieceElement>
  );
}

export default forwardRef<HTMLDivElement, PieceProps>(Piece);
