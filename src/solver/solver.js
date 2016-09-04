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

  search(grid) {
    if(!grid) {
      return false;
    }

    let solved = true;
    for(let i = 0; i < grid.cells.length; i++) {
      solved = solved && grid.cells[i].isSolved();
    }

    if(solved) {
      return grid;
    }

    let cellMinPossibleValues;
    for(let index = 0, cell; index < grid.cells.length; index++) {
      cell = grid.cells[index];
      if(cell.isSolved()) {
        continue;
      }

      if(!cellMinPossibleValues || (cellMinPossibleValues.cell.possibleValues.length > cell.possibleValues.length)) {
        cellMinPossibleValues = {
          cell,
          index
        };
      }
    }
    
    for(let i = 0; i < cellMinPossibleValues.cell.possibleValues.length; i++) {
      let copy = grid.copy();
      
      let result = this.search(copy.assignValue(cellMinPossibleValues.cell.possibleValues[i], copy.cells[cellMinPossibleValues.index]));

      if(result) {
        this._grid = result;
      }
    }
  }

  solve() {

  }

  copy() {
    return new Solver(this._grid.copy());
  }
}

module.exports = Solver;