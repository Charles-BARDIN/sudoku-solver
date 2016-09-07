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
    if (typeof value !== 'number') {
      throw new TypeError('eliminatePossibleValue\'s parameter must be a number');
    } else if ([1, 2, 3, 4, 5, 6, 7, 8, 9].indexOf(value) === -1) {
      throw new RangeError('eliminatePossibleValue\'s parameter must belong to [0, 9]');
    }

    let index = this._possibleValues.indexOf(value);

    if (index === -1) {
      return true;
    }

    if (this.isSolved() && value === this._value) {
      return null;
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
    if (typeof value !== 'number') {
      throw new TypeError('acceptsValue\'s parameter must be a number');
    } else if ([1, 2, 3, 4, 5, 6, 7, 8, 9].indexOf(value) === -1) {
      throw new RangeError('acceptsValue\'s parameter must belong to [0, 9]');
    }

    return (this._possibleValues.indexOf(value) !== -1);
  }

  static copy(toCopy) {
    if (!(toCopy instanceof Cell)) {
      throw new TypeError('static method copy\'s parameter must be a Cell');
    }

    let cell = new Cell();
    cell._possibleValues = [];

    for (let i = 0; i < toCopy.possibleValues.length; i++) {
      cell._possibleValues.push(toCopy.possibleValues[i]);
    }
    cell._value = toCopy.value;

    return cell;
  }
}

module.exports = Cell;