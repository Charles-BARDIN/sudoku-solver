const Cell = require('../cell/cell');

class Siblings {
  constructor(grid) {
    const Grid = require('../grid/grid');

    if(!(grid instanceof Grid)) {
      throw new TypeError('get\'s parameter must be a Grid');
    }

    this._grid = grid;

    let dictionnary = new Map();

    for (let i = 0, cell; i < grid.cells.length; i++) {
      cell = grid.cells[i];
      dictionnary.set(cell, this._getCellSiblings(cell));
    }

    this._siblings = dictionnary;
  }

  eliminateValueFromSiblings(cell, value) {
    if (typeof value !== 'number' && !(cell instanceof Cell)) {
      throw new TypeError('eliminateValueFromSiblings\'s parameters must be a Cell and a number');
    }

    let siblings = this._siblings.get(cell);
    for (let i = 0, success, wasResolved; i < siblings.length; i++) {
      wasResolved = siblings[i].isSolved();

      if (siblings[i].value === value) {
        return null;
      }

      success = siblings[i].eliminatePossibleValue(value);
      if (!success) {
        return null;
      }

      if (siblings[i].isSolved() && !wasResolved) {
        success = this.eliminateValueFromSiblings(siblings[i], siblings[i].value);

        if (!success) {
          return null;
        }
      }
    }
    return true;
  }

  checkIfSiblingsAcceptValue(cell, value) {
    if (typeof value !== 'number' && !(cell instanceof Cell)) {
      throw new TypeError('checkIfSiblingsAcceptValue\'s parameters must be a Cell and a number');
    }

    let cellsThatAccept = [];
    let siblings = this._siblings.get(cell);

    for (let i = 0; i < siblings.length; i++) {
      if (siblings[i].acceptsValue(value)) {
        cellsThatAccept.push(siblings[i]);
      }
    }

    return cellsThatAccept;
  }

  _getCellSiblings(cell) {
    if(!(cell instanceof Cell)) {
      throw new TypeError('internal method getCellSiblings\'s parameter must be a Cell');
    }

    let row = this._getRow(cell);
    let column = this._getColumn(cell);
    let square = this._getSquare(cell);

    let siblings = [];

    for (var i = 0; i < row.length; i++) {
      if (siblings.indexOf(row[i]) === -1) {
        siblings.push(row[i]);
      }

      if (siblings.indexOf(column[i]) === -1) {
        siblings.push(column[i]);
      }

      if (siblings.indexOf(square[i]) === -1) {
        siblings.push(square[i]);
      }
    }

    return siblings;
  }

  _getColumn(cell) {
    if(!(cell instanceof Cell)) {
      throw new TypeError('internal method getColumn\'s parameter must be a Cell');
    }

    let column = [];
    let index = this._grid.cells.indexOf(cell);

    for (var i = 0; i < this._grid.cells.length; i++) {
      if (i % 9 === index % 9 && i !== index) {
        column.push(this._grid.cells[i]);
      }
    }

    return column;
  }

  _getRow(cell) {
    if(!(cell instanceof Cell)) {
      throw new TypeError('internal method getRow\'s parameter must be a Cell');
    }

    let column = [];
    let rowIndexes = {
      min: 0,
      max: 0
    };
    let index = this._grid.cells.indexOf(cell);

    rowIndexes.min = index - (index % 9);
    rowIndexes.max = rowIndexes.min + 9;

    for (let i = 0, _cell; i < this._grid.cells.length; i++) {
      _cell = this._grid.cells[i];
      if (i < rowIndexes.max && i >= rowIndexes.min && i !== index) {
        column.push(_cell);
      }
    }

    return column;
  }

  _getSquare(cell) {
    if(!(cell instanceof Cell)) {
      throw new TypeError('internal method getSquare\'s parameter must be a Cell');
    }

    let intervals = [];
    let index = this._grid.cells.indexOf(cell);
    let minVal = index - (index % 3);
    let squares = [];

    let lineNumberInSqr = Math.floor(index / 9) % 3;

    switch (lineNumberInSqr) {
      case 1:
        minVal -= 9;
        break;
      case 2:
        minVal -= 18;
        break;
    }

    for (let i = 0; i < 3; i++) {
      intervals.push(minVal);
      minVal += 9;
    }

    for (let i = 0; i < intervals.length; i++) {
      for (let j = 0, cellToPush; j < 3; j++) {
        if (intervals[i] + j !== index) {
          squares.push(this._grid.cells[intervals[i] + j]);
        }
      }
    }

    return squares;
  }
}

module.exports = Siblings;