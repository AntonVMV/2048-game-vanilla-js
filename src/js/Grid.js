export class Grid {
  field = [];

  constructor(container) {
    for (let i = 0; i < 4; i++) {
      this.field.push([]);

      for (let k = 0; k < 4; k++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        container.append(cell);

        this.field[i].push(new Cell(cell));
      }
    }
  }

  emptyCells() {
    const empty = [];
    this.field.forEach((row) => {
      row.forEach((item) => {
        if (!item.tile) {
          empty.push(item);
        }
      });
    });

    return empty;
  }

  getRandomCell() {
    const random = Math.floor(Math.random() * this.emptyCells().length);
    return this.emptyCells()[random];
  }
}

export class Cell {
  tileEl = null;
  mergeElem = null;

  constructor(element) {
    this.element = element;
    window.addEventListener("resize", () => this.setTilePosition());
  }

  get tile() {
    return this.tileEl;
  }

  set tile(value) {
    this.tileEl = value;
    if (!value) {
      return;
    }

    this.setTilePosition();
  }

  set mergeTile(value) {
    this.mergeElem = value;
  }

  setTilePosition() {
    if (this.tileEl) {
      this.tileEl.setTileAttrs(
        this.element.offsetLeft,
        this.element.offsetTop,
        this.element.clientWidth,
        this.element.clientHeight
      );
    }
  }

  canMerge(tile) {
    if (!this.tile || (!this.mergeElem && this.tile._value === tile._value)) {
      return true;
    }
    return false;
  }

  mergeTiles() {
    if (!this.tileEl || !this.mergeElem) {
      return;
    }
    const toRemove = this.tileEl.tile;
    toRemove.style.zIndex = 1;

    setTimeout(() => {
      toRemove.remove();
    }, 100);

    this.tile = this.mergeElem;
    this.tileEl.value = this.tileEl.value * 2;
  }
}
