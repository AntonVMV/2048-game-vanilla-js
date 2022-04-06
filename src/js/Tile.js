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
    this.tile.classList.add(`tile`);
    container.append(this.tile);
    this.value = value || this.randomValue();
    this.tile.style.fontSize = this.tile.clientWidth / 4 + "px";
  }

  randomValue() {
    return Math.random() > 0.8 ? 4 : 2;
  }

  setTileAttrs(x, y, width, height) {
    this.tile.style.left = `${x}px`;
    this.tile.style.top = `${y}px`;
    this.tile.style.width = `${width}px`;
    this.tile.style.height = `${height}px`;
    this.tile.style.fontSize =
      width / 2 - this.value.toString().length * 5 + "px";
  }

  set value(val) {
    this._value = val;
    this.tile.innerHTML = val;
    this.tile.classList.add(`${tilesStyles[this.value]}`);
    this.tile.style.fontSize =
      this.tile.clientWidth / 2 - this.value.toString().length * 5 + "px";
  }

  get value() {
    return this._value;
  }
}
