class Cell {
  constructor() {
    this._value = null;
    this._possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  get value() {
    return this._value;
  }

  get possibleValues() {
    return this._possibleValues;
  }

  eliminatePossibleValue(value) {
    let index = this._possibleValues.indexOf(value);

    if (index === -1) {
      return true;
    }

    if (this.isSolved() && value === this._value) {
      return false;
    }

    this._possibleValues.remove(value);

    if (this._possibleValues.length === 1) {
      this._value = this._possibleValues[0];
    }

    return true;
  }

  isSolved() {
    return !(!(this._value));
  }

  acceptsValue(value) {
    return (this._possibleValues.indexOf(value) !== -1);
  }

  copy() {
    let cell = new Cell();
    cell._possibleValues = [];

    for (let i = 0; i < this._possibleValues.length; i++) {
      cell._possibleValues.push(this._possibleValues[i]);
    }
    cell._value = this._value;

    return cell;
  }
}

module.exports = Cell;