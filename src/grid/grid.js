const Cell = require('../cell/cell');

class Grid {
  constructor(pattern) {
    this._cells = [];
    this._pattern = pattern;

    for (let i = 0; i < 81; i++) {
      this._cells.push(new Cell());
    }
  }

  get cells() {
    return this._cells;
  }

  get pattern() {
    return this._pattern;
  }

  assignValue(value, cell) {
    let valuesToEliminate = cell.possibleValues.slice();
    let index = valuesToEliminate.indexOf(value);

    if (index === -1) {
      return false;
    }

    valuesToEliminate.remove(value);

    for (let i = 0, success; i < valuesToEliminate.length; i++) {
      success = this.eliminateValueFromCell(valuesToEliminate[i], cell);

      if (!success) {
        return false;
      }
    }
    return this;
  }

  eliminateValueFromCell(value, cell) {
    let success = cell.eliminatePossibleValue(value);
    if (!success) {
      return false;
    }

    if (cell.isSolved()) {
      success = this.eliminateValueFromSiblings(cell, cell.value);

      if (!success) {
        return false;
      }
    }

    success = this.checkIfSiblingsAcceptValue(cell, value);

    if (!success) {
      return false;
    }
    for (let i = 0, success; i < value.length; i++) {
      success = cell.eliminatePossibleValue(value);

      if (!success) {
        return false;
      }

      if (cell.isSolved()) {
        success = this.eliminateValueFromSiblings(cell, cell.value);

        if (!success) {
          return false;
        }
      }

      success = this.checkIfSiblingsAcceptValue(cell, cell.value);

      if (!success) {
        return false;
      }
    }

    return true;
  }

  eliminateValueFromSiblings(cell, value) {
    let siblings = this.getSiblings(cell);
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
    let siblings = this.getSiblings(cell);

    for (let i = 0; i < siblings.length; i++) {
      if (siblings[i].acceptsValue(value)) {
        cellsThatAccept.push(siblings[i]);
      }
    }

    if (cellsThatAccept.length === 0) {
      return false;
    }

    if (cellsThatAccept.length === 1) {
      let success = this.assignValue(value, cellsThatAccept[0]);

      if (!success) {
        return false;
      }
    }

    return true;
  }

  getSiblings(cell) {
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
    let index = this._cells.indexOf(cell);

    for (var i = 0; i < this._cells.length; i++) {
      if (i % 9 === index % 9 && i !== index) {
        column.push(this._cells[i]);
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
    let index = this._cells.indexOf(cell);

    rowIndexes.min = index - (index % 9);
    rowIndexes.max = rowIndexes.min + 9;

    for (let i = 0, _cell; i < this._cells.length; i++) {
      _cell = this._cells[i];
      if (i < rowIndexes.max && i >= rowIndexes.min && i !== index) {
        column.push(_cell);
      }
    }

    return column;
  }

  getSquare(cell) {
    let intervals = [];
    let index = this._cells.indexOf(cell);
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
          squares.push(this._cells[intervals[i] + j]);
        }
      }
    }

    return squares;
  }

  display(item) {
    let type;

    if(typeof item === 'string') {
      type = 'string';
    } else if (item instanceof Cell) {
      type = 'cell';
    }

    let output = '';
    let divider = '\n------ ------- ------\n';

    let last = item.length - 1;
    for (let i = 0, cell; i < (last + 1); i++) {
      cell = item[i];

      if(type ==='string') {
        output += cell;
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

  displayPattern() {
    this.display(this._pattern);
  }

  displayGrid() {
    this.display(this._cells);
  }

  copy() {
    let grid = new Grid();
    grid._pattern = this._pattern;

    for (var i = 0; i < this._cells.length; i++) {
      grid._cells[i] = this._cells[i].copy();
    }
    return grid;
  }
}

module.exports = Grid;