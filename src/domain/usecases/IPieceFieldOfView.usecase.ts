import Piece from "../../usecases/Piece";
import { IBoardCoords } from "../models/BoardCoords.model";

export interface IFieldOfViewItem {
  position: IBoardCoords;
  piece: Piece
}

export type TFieldOfView = IFieldOfViewItem[];
