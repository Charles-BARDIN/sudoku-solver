const Grid = require('../grid/grid');

class Solver {
  constructor() { }

  solve(grid) {
    if (!(grid instanceof Grid)) {
      throw new TypeError('solve parameter must be a Grid');
    }

    let _grid = Grid.copy(grid);

    let solvedGrid = this._search(this._setPatternValues(_grid));

    if (!solvedGrid) {
      return null;
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
      result = grid.assignValue(grid.cells[i], digit);

      if (!result) {
        return null;
      }
    }

    return grid;
  }

  _search(grid) {
    if (!grid) {
      return null;
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

      result = this._search(copy.assignValue(copy.cells[cellMinPossibleValues.index], cellMinPossibleValues.cell.possibleValues[i]));

      if (result) {
        return result;
      }
    }

    return null;
  }
}

module.exports = Solver;