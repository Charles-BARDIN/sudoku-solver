const Cell = require('../cell/cell');
const Siblings = require('../siblings/siblings');

class Grid {
  constructor(pattern) {
    if (typeof pattern !== 'string' && !(pattern instanceof Array)) {
      throw new TypeError('Grid\'s constuctor\'s parameter must be a string or an array of strings');
    }

    if (pattern.length !== 81) {
      throw new RangeError('Grid\'s constuctor\'s parameter must be 81 long');
    }

    if (pattern instanceof Array) {
      for (let i = 0; i < pattern.length; i++) {
        if (typeof pattern[i] === 'number') {
          pattern[i] = String(pattern[i]);
        }
        if (typeof pattern[i] !== 'string' || pattern[i].length > 1) {
          throw new TypeError('Grid\'s constructor parameter is in wrong format');
        }
      }

      pattern = pattern.join('');
    }

    this._cells = [];
    this._pattern = pattern;

    for (let i = 0; i < 81; i++) {
      this._cells.push(new Cell());
    }

    this._siblings = null;
  }

  get cells() {
    return this._cells;
  }

  get pattern() {
    return this._pattern;
  }

  get siblings() {
    return this._siblings;
  }

  isSolved() {
    for (let i = 0; i < this._cells.length; i++) {
      if (!this._cells[i].isSolved()) {
        return false;
      }
    }

    return true;
  }

  assignValue(cell, value) {
    if (!(typeof value === 'number' && cell instanceof Cell)) {
      throw new TypeError('assignValue\'s parameters must be a number and a Cell');
    }

    let valuesToEliminate = (cell.possibleValues).slice();
    let index = valuesToEliminate.indexOf(value);

    if (index === -1) {
      return null;
    }

    valuesToEliminate.splice(valuesToEliminate.indexOf(value), 1);

    for (let i = 0, success; i < valuesToEliminate.length; i++) {
      success = this._eliminateValueFromCell(cell, valuesToEliminate[i]);

      if (!success) {
        return null;
      }
    }
    return this;
  }

  static copy(toCopy) {
    if (!(toCopy instanceof Grid)) {
      throw new TypeError('static method copy\'s parameter must be a Grid');
    }

    let grid = new Grid(toCopy.pattern);

    for (var i = 0; i < toCopy.cells.length; i++) {
      grid._cells[i] = Cell.copy(toCopy.cells[i]);
    }

    grid._siblings = new Siblings(grid);

    return grid;
  }

  _setSiblings() {
    if (this._siblings) {
      return;
    }

    this._siblings = new Siblings(this);
  }

  _eliminateValueFromCell(cell, value) {
    if (typeof value !== 'number' && !(cell instanceof Cell)) {
      throw new TypeError('private method eliminateValueFromCell\'s parameters must be a number and a Cell');
    }

    let success = cell.eliminatePossibleValue(value);
    if (!success) {
      return null;
    }

    this._setSiblings();

    if (cell.isSolved()) {
      success = this._siblings.eliminateValueFromSiblings(cell, cell.value);

      if (!success) {
        return null;
      }
    }

    success = this._checkValueForSiblings(cell, value);

    if (!success) {
      return null;
    }

    return true;
  }

  _checkValueForSiblings(cell, value) {
    if (typeof value !== 'number' && !(cell instanceof Cell)) {
      throw new TypeError('private method checkValueForSiblings\'s parameters must be a number and a Cell');
    }

    let cellsThatAccept = this._siblings.checkIfSiblingsAcceptValue(cell, value);

    if (cellsThatAccept.length === 0) {
      return null;
    }

    if (cellsThatAccept.length === 1) {
      let success = this.assignValue(cellsThatAccept[0], value);

      if (!success) {
        return null;
      }
    }

    return true;
  }
}

module.exports = Grid;