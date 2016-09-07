const Cell = require('../cell/cell');
const Siblings = require('../siblings/siblings');

module.exports = class Grid {
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

  assignValue(value, cell) {
    if (typeof value !== 'number' && !(cell instanceof Cell)) {
      throw new TypeError('assignValue\'s parameters must be a number and a Cell');
    }

    let valuesToEliminate = Array.copy(cell.possibleValues);
    let index = valuesToEliminate.indexOf(value);

    if (index === -1) {
      return null;
    }

    valuesToEliminate.remove(value);

    for (let i = 0, success; i < valuesToEliminate.length; i++) {
      success = this._eliminateValueFromCell(valuesToEliminate[i], cell);

      if (!success) {
        return null;
      }
    }
    return this;
  }

  displayPattern() {
    this._display(this._pattern);
  }

  displayGrid() {
    this._display(this._cells);
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

  _eliminateValueFromCell(value, cell) {
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

    success = this._checkSiblingsValue(cell, value);

    if (!success) {
      return null;
    }

    return true;
  }

  _checkSiblingsValue(cell, value) {
    if (typeof value !== 'number' && !(cell instanceof Cell)) {
      throw new TypeError('private method checkSiblingsValue\'s parameters must be a number and a Cell');
    }

    let cellsThatAccept = this._siblings.checkIfSiblingsAcceptValue(cell, value);

    if (cellsThatAccept.length === 0) {
      return null;
    }

    if (cellsThatAccept.length === 1) {
      let success = this.assignValue(value, cellsThatAccept[0]);

      if (!success) {
        return null;
      }
    }

    return true;
  }

  _display(item) {
    let type;
    if (typeof item === 'string') {
      type = 'string';
    } else if (item instanceof Array) {
      type = 'cell';
    } else {
      throw new TypeError('private method display\'s parameter must be a string or an array of Cells');
    }

    if (item.length !== 81) {
      throw new RangeError('private method display\'s parameter must be 81 long');
    }

    if (type === 'cell') {
      for (let i = 0; i < item.length; i++) {
        if (!(item[i] instanceof Cell)) {
          throw new TypeError('the array must be composed of Cells');
        }
      }
    }

    let output = '';
    let divider = '\n------ ------- ------\n';

    let last = item.length - 1;
    for (let i = 0, cell; i < (last + 1); i++) {
      cell = item[i];

      if (type === 'string') {
        output += Number(cell) ? cell : '.';
      } else {
        output += (cell.value) ? (cell.value) : ('.');
      }

      output += ' ';

      if ((i % 27 === 26) && (i !== last)) {
        output += divider;
      } else if (i % 9 === 8) {
        output += '\n';
      } else if (i % 3 === 2) {
        output += '| ';
      }
    }
    console.log(output);
  }
};