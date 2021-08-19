import { Position } from '../../domain/models/DraggableTypes';
import { IDraggableUseCase } from '../../domain/usecases/IDraggable.usecase';

class Draggable implements IDraggableUseCase {
  position = new Position(0, 0);
  offset = new Position(0, 0);
  initialStylePosition = 'static';

  dragMouseDown(e: React.MouseEvent<HTMLDivElement>): void {
    if (!e || !e.target) return;
    e.preventDefault();

    // get the mouse cursor position at startup:
    const target = e.target as HTMLElement;
    const { offsetLeft, offsetTop } = target;

    this.offset = new Position(offsetLeft - e.clientX, offsetTop - e.clientY);

    this.initialStylePosition = target.style.position;

    document.onmouseup = () => this.closeDragElement(target);
    document.onmousemove = (ev) => this.elementDrag(ev, target);
  }

  elementDrag(e: MouseEvent, target: HTMLElement): void {
    e.preventDefault();

    // calculate the new cursor position:
    this.position = new Position(e.clientX, e.clientY);    

    // set the element's new position:
    target.style.top = (this.position.y + this.offset.y) + "px";
    target.style.left = (this.position.x + this.offset.x) + "px";
    target.style.position = "absolute";
  }

  closeDragElement(target: HTMLElement): void {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;

    target.style.position = this.initialStylePosition;
  }
}

export default Draggable;
