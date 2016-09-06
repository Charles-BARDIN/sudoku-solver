class Siblings {
  constructor(grid) {
    this._grid = grid;

    let dictionnary = new Map();

    for (let i = 0, cell; i < grid.cells.length; i++) {
      cell = grid.cells[i];
      dictionnary.set(cell, this.getCellSiblings(cell));
    }

    this._siblings = dictionnary;
  }

  get(cell) {
    return this._siblings.get(cell);
  }

  eliminateValueFromSiblings(cell, value) {
    let siblings = this._siblings.get(cell);
    for (let i = 0, success, wasResolved; i < siblings.length; i++) {
      wasResolved = siblings[i].isSolved();

      if (siblings[i].value === value) {
        return false;
      }

      success = siblings[i].eliminatePossibleValue(value);
      if (!success) {
        return false;
      }

      if (siblings[i].isSolved() && !wasResolved) {
        success = this.eliminateValueFromSiblings(siblings[i], siblings[i].value);

        if (!success) {
          return false;
        }
      }
    }
    return true;
  }

  checkIfSiblingsAcceptValue(cell, value) {
    let cellsThatAccept = [];
    let siblings = this._siblings.get(cell);

    for (let i = 0; i < siblings.length; i++) {
      if (siblings[i].acceptsValue(value)) {
        cellsThatAccept.push(siblings[i]);
      }
    }

    return cellsThatAccept;
  }

  getCellSiblings(cell) {
    let row = this.getRow(cell);
    let column = this.getColumn(cell);
    let square = this.getSquare(cell);

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

  getColumn(cell) {
    let column = [];
    let index = this._grid.cells.indexOf(cell);

    for (var i = 0; i < this._grid.cells.length; i++) {
      if (i % 9 === index % 9 && i !== index) {
        column.push(this._grid.cells[i]);
      }
    }

    return column;
  }

  getRow(cell) {
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

  getSquare(cell) {
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