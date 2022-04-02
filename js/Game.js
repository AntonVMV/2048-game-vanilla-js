import { Grid } from "./Grid.js";
import { Tile } from "./Tile.js";
import { Controls } from "./Controls.js";
import { createElement } from "./helper.js";

export class Game {
  constructor(container) {
    this.move = false;
    this.container = container;

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

  moveHandler(e) {
    const rotated = this.rotateMartix(this.grid.field);

    switch (e.key) {
      case "ArrowLeft":
        this.grid.field.forEach((row) => this.swipeLine(row));
        break;

      case "ArrowRight":
        this.grid.field.forEach((row) => this.swipeLine([...row].reverse()));
        break;

      case "ArrowDown":
        rotated.forEach((row) => this.swipeLine(row));
        break;

      case "ArrowUp":
        rotated.forEach((row) => this.swipeLine([...row].reverse()));
        break;
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
