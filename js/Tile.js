const tilesStyles = {
  2: "tile-2",
  4: "tile-4",
  8: "tile-8",
  16: "tile-16",
  32: "tile-32",
  64: "tile-64",
  128: "tile-128",
  256: "tile-256",
  512: "tile-512",
  1024: "tile-1024",
  2048: "tile-2048",
};

export class Tile {
  constructor(container, value) {
    this.tile = document.createElement("div");
    this.value = value || this.randomValue();
    this.tile.classList.add(`tile`);
    container.append(this.tile);
  }

  randomValue() {
    return Math.random() > 0.8 ? 4 : 2;
  }

  set value(val) {
    this._value = val;
    this.tile.innerHTML = val;
    this.tile.classList.add(`${tilesStyles[this.value]}`);
  }

  get value() {
    return this._value;
  }

  set setX(value) {
    this.x = value;
    this.tile.style.left = `${value}px`;
  }

  set setY(value) {
    this.y = value;
    this.tile.style.top = `${value}px`;
  }
}
