const expect = require('chai').expect;

const Cell = require('./cell');

let cell;

describe('Class: Cell', () => {
  describe('Methods', () => {
    beforeEach(() => {
      cell = new Cell();
    });

    describe('eliminatePossibleValue', () => {
      it('Should have eliminated the value from its possible values', () => {
        cell.eliminatePossibleValue(1);

        expect(cell.possibleValues).to.have.members([2, 3, 4, 5, 6, 7, 8, 9]);
      });

      it('Should have set its value if it remained only one possible value', () => {
        cell.eliminatePossibleValue(1);
        cell.eliminatePossibleValue(2);
        cell.eliminatePossibleValue(3);
        cell.eliminatePossibleValue(4);
        cell.eliminatePossibleValue(5);
        cell.eliminatePossibleValue(6);
        cell.eliminatePossibleValue(7);
        cell.eliminatePossibleValue(8);

        expect(cell.value).to.equal(9);
      });

      it('Should return true if it hasn\'t noticed any inconsistency', () => {
        expect(cell.eliminatePossibleValue(1)).to.be.equal(true);
      });

      it('Should return false if it has noticed any inconsistency', () => {
        cell._value = 1;
        expect(cell.eliminatePossibleValue(1)).to.equal(false);
      });
    });

    describe('isSolved', () => {
      beforeEach(() => {
        cell.eliminatePossibleValue(1);
        cell.eliminatePossibleValue(2);
        cell.eliminatePossibleValue(3);
        cell.eliminatePossibleValue(4);
        cell.eliminatePossibleValue(5);
        cell.eliminatePossibleValue(6);
        cell.eliminatePossibleValue(7);
      });

      it('Should return true if its value is set', () => {
        cell.eliminatePossibleValue(8);

        expect(cell.isSolved()).to.equal(true);
      });

      it('Should return false if its value is not set', () => {
        expect(cell.isSolved()).to.equal(false);
      });
    });

    describe('acceptsValue', () => {
      beforeEach(() => {
        cell.eliminatePossibleValue(3);
      });

      it('Should return true if the value belongs to its possible values', () => {
        expect(cell.acceptsValue(5)).to.equal(true);
      });

      it('Should return false if the value does not belong to its possible values', () => {
        expect(cell.acceptsValue(3)).to.equal(false);
      });
    });
  });
});