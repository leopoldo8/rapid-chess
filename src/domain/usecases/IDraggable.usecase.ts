import { Position } from "../models/DraggableTypes";

export interface IDraggableUseCase {
  position: Position;
  offset: Position;
  initialStylePosition: string;

  /**
   * Configures the drag to work at the mouse down event.
   */
  dragMouseDown(e: React.MouseEvent<HTMLDivElement>): void;

  /**
   * Drags the element within the mouse down position.
   */
  elementDrag(e: MouseEvent, target: HTMLElement): void;

  /**
   * Removes the drag listeners.
   */
  closeDragElement(target: HTMLElement): void;
}
