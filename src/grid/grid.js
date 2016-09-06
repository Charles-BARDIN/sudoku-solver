const Cell = require('../cell/cell');
const Siblings = require('../siblings/siblings');

class Grid {
  constructor(pattern) {
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

  setSiblings() {
    if (this._siblings) {
      return;
    }

    this._siblings = new Siblings(this);
  }

  assignValue(value, cell) {
    let valuesToEliminate = Array.copy(cell.possibleValues);
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
    this.setSiblings();

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
    this.setSiblings();
    let cellsThatAccept = [];
    let siblings = this._siblings.get(cell);

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

  display(item) {
    let type;

    if (typeof item === 'string') {
      type = 'string';
    } else if (item instanceof Cell) {
      type = 'cell';
    }

    let output = '';
    let divider = '\n------ ------- ------\n';

    let last = item.length - 1;
    for (let i = 0, cell; i < (last + 1); i++) {
      cell = item[i];

      if (type === 'string') {
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

  static copy(toCopy) {
    let grid = new Grid(toCopy.pattern);

    for (var i = 0; i < toCopy.cells.length; i++) {
      grid._cells[i] = Cell.copy(toCopy.cells[i]);
    }

    grid._siblings = new Siblings(grid);

    return grid;
  }
}

module.exports = Grid;