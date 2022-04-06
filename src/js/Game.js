import { Grid } from "./Grid";
import { Tile } from "./Tile";
import { Controls } from "./Controls";
import { createElement } from "./helper";

export class Game {
  constructor(container) {
    this.move = false;
    this.container = container;
    this.touchStart = null;

    const startButton = createElement(
      "button",
      "start-btn",
      this.container,
      "New Game"
    );
    startButton.addEventListener("click", this.newGame.bind(this));
    this.container.append(startButton);

    this.gameField = createElement("div", "game-field", this.container);

    this.controls = new Controls(this.container);
    this.grid = new Grid(this.gameField);

    document.addEventListener("keydown", this.moveHandler.bind(this));
    document.addEventListener(
      "touchstart",
      (e) => (this.touchStart = [e.touches[0].clientX, e.touches[0].clientY])
    );

    document.addEventListener("touchend", this.moveHandler.bind(this));
  }

  newGame() {
    if (this.controls.game) {
      const field = this.grid.field;
      for (let i = 0; i < field.length; i++) {
        for (let k = 0; k < field[i].length; k++) {
          if (field[i][k].tileEl) {
            field[i][k].tileEl.tile.remove();
            field[i][k].tile = null;
          }
        }
      }
    }

    this.controls.game = true;
    this.controls.score = 0;
    this.controls.maxTile = 0;

    this.spawnTile();
    this.spawnTile();
  }

  spawnTile() {
    this.grid.getRandomCell().tile = new Tile(this.gameField);
  }

  swipeHandler(e) {
    const moveX = this.touchStart[0] - e.changedTouches[0].clientX;
    const moveY = this.touchStart[1] - e.changedTouches[0].clientY;

    if (Math.abs(moveX) > Math.abs(moveY)) {
      if (moveX > 0) {
        this.moveLeft();
      } else {
        this.moveRight();
      }
    } else {
      if (moveY > 0) {
        this.moveUp();
      } else {
        this.moveDown();
      }
    }
  }

  keyHandler(key) {
    switch (key) {
      case "ArrowLeft":
        this.moveLeft();
        break;

      case "ArrowRight":
        this.moveRight();
        break;

      case "ArrowDown":
        this.moveDown();
        break;

      case "ArrowUp":
        this.moveUp();
        break;
    }
  }

  moveHandler(e) {
    if (e instanceof TouchEvent) {
      this.swipeHandler(e);
    } else {
      this.keyHandler(e.key);
    }

    this.grid.field.forEach((row) => {
      row.forEach((cell) => {
        cell.mergeTile = null;
      });
    });

    if (this.move) {
      this.spawnTile();
      this.move = false;

      if (!this.isMovePosible()) {
        setTimeout(() => {
          alert("game over");
        }, 500);
      }
    }
  }

  moveLeft() {
    this.grid.field.forEach((row) => this.swipeLine(row));
  }

  moveRight() {
    this.grid.field.forEach((row) => this.swipeLine([...row].reverse()));
  }

  moveUp() {
    const rotated = this.rotateMartix(this.grid.field);
    rotated.forEach((row) => this.swipeLine([...row].reverse()));
  }

  moveDown() {
    const rotated = this.rotateMartix(this.grid.field);
    rotated.forEach((row) => this.swipeLine(row));
  }

  rotateMartix(matrix) {
    const newMatrix = [];
    for (let i = 0; i < matrix.length; i++) {
      newMatrix.push([]);
      for (let k = matrix[i].length - 1; k >= 0; k--) {
        newMatrix[i].push(matrix[k][i]);
      }
    }
    return newMatrix;
  }

  swipeLine(line) {
    for (let i = 1; i < line.length; i++) {
      let correctCell = null;
      for (let k = i - 1; k >= 0; k--) {
        if (!line[i].tile) {
          continue;
        }

        if (!line[k].canMerge(line[i].tile)) {
          break;
        }

        correctCell = line[k];
      }

      if (correctCell) {
        this.move = true;
        if (correctCell.tile) {
          correctCell.mergeTile = line[i].tile;
          correctCell.mergeTiles();

          this.controls.score = this.controls.score + correctCell.tile.value;
          if (correctCell.tile.value > this.controls.maxTile) {
            this.controls.maxTile = correctCell.tile.value;
          }
        } else {
          correctCell.tile = line[i].tile;
        }
        line[i].tile = null;
      }
    }
  }

  isMovePosible() {
    const field = this.grid.field;

    return field.some((row, i) => {
      return row.some((cell, k) => {
        if (!cell.tile) {
          return true;
        } else if (
          (field[i - 1]?.[k]?.tile && field[i - 1][k].canMerge(cell.tile)) ||
          (field[i + 1]?.[k]?.tile && field[i + 1][k].canMerge(cell.tile)) ||
          (row[k - 1]?.tile && row[k - 1].canMerge(cell.tile)) ||
          (row[k + 1]?.tile && row[k + 1].canMerge(cell.tile))
        ) {
          return true;
        } else {
          return false;
        }
      });
    });
  }
}
