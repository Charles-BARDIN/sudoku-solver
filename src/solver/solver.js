const Grid = require('../grid/grid');

class Solver {
  constructor() { }

  solve(grid) {
    if (!(grid instanceof Grid)) {
      throw new TypeError('solve parameter must be a Grid');
    }

    let _grid = Grid.copy(grid);
    this._setPatternValues(_grid);

    let solvedGrid = this._search(_grid);

    if (!solvedGrid) {
      return false;
    }

    return solvedGrid;
  }

  _setPatternValues(grid) {
    if (!(grid instanceof Grid)) {
      throw new TypeError('private method setPatternValues\'s parameter must be a Grid');
    }

    let pattern = grid.pattern;

    for (let i = 0, digit, result; i < pattern.length; i++) {
      digit = Number(pattern[i]);

      if (isNaN(digit) || digit === 0) {
        continue;
      }
      result = grid.assignValue(digit, grid.cells[i]);

      if (!result) {
        return false;
      }
    }

    return true;
  }

  _search(grid) {
    if (!grid) {
      return false;
    }

    if (!(grid instanceof Grid)) {
      throw new TypeError('private method search\'s parameter must be a Grid');
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

      result = this._search(copy.assignValue(cellMinPossibleValues.cell.possibleValues[i], copy.cells[cellMinPossibleValues.index]));

      if (result) {
        return result;
      }
    }

    return false;
  }
}

module.exports = Solver;