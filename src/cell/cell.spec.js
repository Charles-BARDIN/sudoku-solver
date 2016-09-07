const expect = require('chai').expect;
const Cell = require('../cell/cell');

require('../polyfills');

let cell;

describe('Class: Cell', () => {
  describe('Constructor', () => {
    beforeEach(() => {
      cell = new Cell();
    });

    describe('Properties', () => {
      describe('value', () => {
        it('Should be defined', () => {
          expect(cell.value).not.to.be.undefined;
        });
      });

      describe('possibleValues', () => {
        it('Should be defined', () => {
          expect(cell.possibleValues).not.to.be.undefined;
        });

        it('Should be an array of digit from 1 to 9', () => {
          expect(cell.possibleValues).to.have.members([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });
      });
    });
  });

  describe('Methods', () => {
    beforeEach(() => {
      cell = new Cell();
    });

    describe('Public', () => {
      describe('eliminatePossibleValue', () => {
        it('Should accept a number belonging to [1, 9] as a parameter', () => {
          expect(() => {cell.eliminatePossibleValue(1);}).to.not.throw(TypeError);
        });

        it('Should throw an error if the parameter is not a number', () => {
          expect(() => {cell.eliminatePossibleValue('1');}).to.throw(TypeError);
          expect(() => {cell.eliminatePossibleValue([1]);}).to.throw(TypeError);
          expect(() => {cell.eliminatePossibleValue({});}).to.throw(TypeError);
        });

        it('Should throw an error if the parameter is a number but does not belong to [1, 9]', () => {
          expect(() => {cell.eliminatePossibleValue(10);}).to.throw(RangeError);
        });

        it('Should return false if it has encountered any inconsistency', () => {
          cell._possibleValues = [9];
          cell._value = 9;

          expect(cell.eliminatePossibleValue(9)).to.be.false;
        });

        it('Should return true if it has not encountered any inconsistency', () => {
          expect(cell.eliminatePossibleValue(1)).to.be.true;
        });

        it('Should set the cell value if it only remains only one possible value', () => {
          cell._possibleValues = [8, 9];

          cell.eliminatePossibleValue(9);

          expect(cell.value).to.equal(8);
        });

        it('Should have removed the value from possibleValues', () => {
          cell.eliminatePossibleValue(9);

          expect(cell.possibleValues).to.have.members([1, 2, 3, 4, 5, 6, 7, 8]);
        });
      });

      describe('isSolved', () => {
        it('Should return true if the value of the cell is determinated', () => {
          cell._possibleValues = [9];
          cell._value = 9;

          expect(cell.isSolved()).to.be.true;
        });

        it('Should return false if the value of the cell is not determinated', () => {
          expect(cell.isSolved()).to.be.false;
        });
      });

      describe('acceptsValue', () => {
        it('Should throw an error if the parameter is not a number', () => {
          expect(() => {cell.acceptsValue('1');}).to.throw(TypeError);
          expect(() => {cell.acceptsValue({});}).to.throw(TypeError);
          expect(() => {cell.acceptsValue([1]);}).to.throw(TypeError);
        });

        it('Should accept a number as a parameter', () => {
          expect(() => {cell.acceptsValue(1);}).to.not.throw(TypeError);
        });

        it('Should return true if the value is a possible value of the cell', () => {
          expect(cell.acceptsValue(1)).to.be.true;
        });

        it('Should return false if the value is not a possible value of the cell', () => {
          cell._possibleValues = [1];

          expect(cell.acceptsValue(2)).to.be.false;
        });
      });
    });

    describe('Static', () => {
      describe('copy', () => {
        it('Should accept a Cell as a parameter', () => {
          expect(() => {Cell.copy(cell);}).to.not.throw(TypeError);
        });

        it('Should throw an error if the parameter is not a Cell', () => {
          expect(() => {Cell.copy(1);}).to.throw(TypeError);
          expect(() => {Cell.copy('1');}).to.throw(TypeError);
          expect(() => {Cell.copy([1]);}).to.throw(TypeError);
          expect(() => {Cell.copy({});}).to.throw(TypeError);
        });

        it('Should return a Cell with the same value and possibleValues', () => {
          let poss_val = [1, 9];
          cell._possibleValues = poss_val;

          let copy = Cell.copy(cell);

          expect(copy.value).to.equal(cell.value);
          expect(copy.possibleValues).to.have.members(cell.possibleValues);
        });
      });
    });
  });
});