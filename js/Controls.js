import { createElement } from "./helper.js";

export class Controls {
  constructor(container) {
    this.game = false;
    const table = createElement("div", "table", container);

    this.scoreElement = createElement("p", "score", table);
    this.maxTileElement = createElement("p", "max-tile", table);

    this.score = 0;
    this.maxTile = 0;
  }

  newGame() {
    console.log("asd");
    this.game = true;
    this.score = 0;
    this.maxTile = 0;
  }

  set score(value) {
    this._score = value;
    this.scoreElement.innerHTML = `Score: ${value}`;
  }

  get score() {
    return this._score;
  }

  set maxTile(value) {
    this._maxTile = value;
    this.maxTileElement.innerHTML = `Max Tile: ${value}`;
  }

  get maxTile() {
    return this._maxTile;
  }
}
