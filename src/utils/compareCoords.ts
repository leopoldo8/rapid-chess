import { IBoardCoords } from "../domain/models/BoardCoords.model";

const compareCoords = (coordA: IBoardCoords, coordB: IBoardCoords) => (
  coordA.x === coordB.x && coordA.y === coordB.y
);

export default compareCoords;
