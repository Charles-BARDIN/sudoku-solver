const Grid = require('../grid/grid');

class Solver {
  constructor(grid) {
    this._grid = grid;
  }

  get grid() {
    return this._grid;
  }

  setGridValues() {
    let pattern = this._grid.pattern;

    for (let i = 0, digit, result; i < pattern.length; i++) {
      digit = Number(pattern[i]);

      if (isNaN(digit) || digit === 0) {
        continue;
      }
      result = this._grid.assignValue(digit, this._grid.cells[i]);

      if (!result) {
        return false;
      }
    }

    return this._grid;
  }

  solve() {
    let solvedGrid = this.search(this.setGridValues());

    if (!solvedGrid) {
      return false;
    }

    for (let i = 0; i < this._grid._cells.length; i++) {
      this._grid._cells[i] = solvedGrid.cells[i];
    }

    return true;
  }

  search(grid) {
    if (!grid) {
      return false;
    }

    if (grid.isSolved()) {
      return grid;
    }

    let cellMinPossibleValues;
    for (let index = 0, cell; index < grid.cells.length; index++) {
      cell = grid.cells[index];
      if (cell.isSolved()) {
        continue;
      }

      if (!cellMinPossibleValues || (cellMinPossibleValues.cell.possibleValues.length > cell.possibleValues.length)) {
        cellMinPossibleValues = {
          cell,
          index
        };
      }
    }

    for (let i = 0, copy, result; i < cellMinPossibleValues.cell.possibleValues.length; i++) {
      copy = Grid.copy(grid);

      result = this.search(copy.assignValue(cellMinPossibleValues.cell.possibleValues[i], copy.cells[cellMinPossibleValues.index]));

      if (result) {
        return result;
      }
    }

    return false;
  }
}

module.exports = Solver;