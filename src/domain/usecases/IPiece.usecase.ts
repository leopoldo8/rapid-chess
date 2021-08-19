import { IBoardCoords } from "../models/BoardCoords.model";
import { IDraggableUseCase } from "./IDraggable.usecase";

export interface IPieceUseCase extends IDraggableUseCase {
  dropMouseUp(e: React.MouseEvent<HTMLDivElement>): void;
  canMoveTo(coords: IBoardCoords): boolean;
  get boardPosition(): IBoardCoords;
}
