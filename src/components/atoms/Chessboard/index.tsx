import { boardId, ColumnsNames, RowsNames } from "../../../constants/board";
import { EPiecesType, PieceInstance, TPieceColor } from "../../../domain/models/PiecesType";
import Piece from "../Piece";

import { Table, TableHeader, TableCell } from './style';

const Chessboard = () => {
  const piecesDefaultArrange = (color: TPieceColor) => ([
    new PieceInstance(EPiecesType.rook, color),
    new PieceInstance(EPiecesType.knight, color),
    new PieceInstance(EPiecesType.bishop, color),
    new PieceInstance(EPiecesType.queen, color),
    new PieceInstance(EPiecesType.king, color),
    new PieceInstance(EPiecesType.bishop, color),
    new PieceInstance(EPiecesType.knight, color),
    new PieceInstance(EPiecesType.rook, color)
  ]);

  const pieces: PieceInstance[][] = [
    piecesDefaultArrange('dark'),
    Array(8).fill(new PieceInstance(EPiecesType.pawn, 'dark')),
    [],
    [],
    [],
    [],
    Array(8).fill(new PieceInstance(EPiecesType.pawn, 'light')),
    piecesDefaultArrange('light')
  ];

  const Columns = ({ row }) => (
    <>
      {
        Array(8).fill(0).map((v, index) => (
          <TableCell data-column={ColumnsNames[index]} key={`${ColumnsNames[index]}-${index}`}>
            { pieces[row][index] && <Piece {...pieces[row][index]} /> }
          </TableCell>
        ))
      }
    </>
  );

  const Rows = () => (
    <>
      {
        Array(8).fill(0).map((v, index) => (
          <tr data-row={String(RowsNames[index])} key={RowsNames[index]}>
            <td>{ RowsNames[index] }</td>
            <Columns row={index} />
          </tr>
        ))
      }
    </>
  );

  const RenderColumnsNames = () => (
    <tr>
      <TableHeader />
      {
        ColumnsNames.map((name) => (
          <TableHeader key={name}>{ name }</TableHeader>
        ))
      }
    </tr>
  )

  return (
    <>
      <Table id={boardId} className="chess-board">
        <tbody>
          <RenderColumnsNames />
          <Rows />
        </tbody>
      </Table>
    </>
  );
}

export default Chessboard;
