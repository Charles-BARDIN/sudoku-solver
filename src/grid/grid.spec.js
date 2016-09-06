const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);

require('../polyfills');

const Grid = require('./grid');
const Cell = require('../cell/cell');

let grid, cell, spy;
let pattern = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';

describe('Class: Grid', () => {
  describe('Methods', () => {
    beforeEach(() => {
      grid = new Grid(pattern);
    });

    describe('assignValue', () => {
      it('Should call eliminateValueFromCell', () => {
        spy = chai.spy.on(grid, 'eliminateValueFromCell');

        grid.assignValue(9, grid.cells[0]);

        expect(spy).to.have.been.called.with(1, grid.cells[0]);
        expect(spy).to.have.been.called.with(2, grid.cells[0]);
        expect(spy).to.have.been.called.with(3, grid.cells[0]);
        expect(spy).to.have.been.called.with(4, grid.cells[0]);
        expect(spy).to.have.been.called.with(5, grid.cells[0]);
        expect(spy).to.have.been.called.with(6, grid.cells[0]);
        expect(spy).to.have.been.called.with(7, grid.cells[0]);
        expect(spy).to.have.been.called.with(8, grid.cells[0]);
      });

      it('Should return itself if it has not encountered any inconsistency', () => {
        expect(grid.assignValue(1, grid.cells[0])).to.equal(grid);
      });

      it('Should return false if it has encountered any inconsistency', () => {
        grid.assignValue(1, grid.cells[0]);
        expect(grid.assignValue(1, grid.cells[1])).to.equal(false);
      });
    });

    describe('eliminateValueFromCell', () => {
      it('Should call the eliminatePossibleValue method of the cell', () => {
        cell = grid.cells[0];
        spy = chai.spy.on(cell, 'eliminatePossibleValue');

        grid.eliminateValueFromCell([1], cell);

        expect(spy).to.have.been.called.with([1]);
      });

      it('Should call the isSolved method of the cell', () => {
        cell = grid.cells[0];
        spy = chai.spy.on(cell, 'isSolved');

        grid.eliminateValueFromCell([1], cell);

        expect(spy).to.have.been.called();
      });

      it('Should call eliminateValueFromSiblings if the isSolved method of the cell returned true', () => {
        cell = grid.cells[0];
        spy = chai.spy.on(grid, 'eliminateValueFromSiblings');

        grid.eliminateValueFromCell(1, cell);
        grid.eliminateValueFromCell(2, cell);
        grid.eliminateValueFromCell(3, cell);
        grid.eliminateValueFromCell(4, cell);
        grid.eliminateValueFromCell(5, cell);
        grid.eliminateValueFromCell(6, cell);
        grid.eliminateValueFromCell(7, cell);
        grid.eliminateValueFromCell(8, cell);

        if (cell.isSolved()) {
          expect(spy).to.have.been.called.with(cell, cell.value);
        } else {
          expect(false).to.equal(true);
        }
      });

      it('Should call checkIfSiblingsAcceptValue', () => {
        cell = grid.cells[0];
        spy = chai.spy.on(grid, 'checkIfSiblingsAcceptValue');

        grid.eliminateValueFromCell(1, cell);

        expect(spy).to.have.been.called.with(cell, 1);
      });

      it('Should return false if it encounter any inconsistency', () => {
        cell = grid.cells[0];

        grid.eliminateValueFromCell(1, cell);
        grid.eliminateValueFromCell(2, cell);
        grid.eliminateValueFromCell(3, cell);
        grid.eliminateValueFromCell(4, cell);
        grid.eliminateValueFromCell(5, cell);
        grid.eliminateValueFromCell(6, cell);
        grid.eliminateValueFromCell(7, cell);
        grid.eliminateValueFromCell(8, cell);

        expect(grid.eliminateValueFromCell([9], cell)).to.equal(false);
      });

      it('Should return true and have removed the values from the cell\'s possible values if it does not encounter any inconsistency', () => {
        cell = grid.cells[0];

        grid.eliminateValueFromCell(1, cell);
        grid.eliminateValueFromCell(2, cell);
        grid.eliminateValueFromCell(3, cell);
        grid.eliminateValueFromCell(4, cell);
        grid.eliminateValueFromCell(5, cell);
        grid.eliminateValueFromCell(6, cell);
        grid.eliminateValueFromCell(7, cell);

        expect(grid.eliminateValueFromCell(9, cell)).to.equal(true);
        expect(cell.possibleValues).to.have.members([8]);
      });
    });

    describe('eliminateValueFromSiblings', () => {
      beforeEach(() => {
        grid.setSiblings();
      });

      it('Should have eliminated the value from all the siblings', () => {
        let siblings = grid._siblings.get(grid.cells[0]);

        grid.eliminateValueFromSiblings(grid.cells[0], 1);

        for (let i = 0; i < siblings.length; i++) {
          expect(siblings[i].possibleValues.indexOf(1)).to.equal(-1);
        }
      });

      it('Should return false if it encounters any inconsistency', () => {
        let siblings = grid._siblings.get(grid.cells[2]);
        siblings[0]._value = 2;

        expect(grid.eliminateValueFromSiblings(grid.cells[2], 2)).to.equal(false);
      });

      it('Should return true if it does not encounter any inconsistency', () => {
        let siblings = grid._siblings.get(grid.cells[2]);

        expect(grid.eliminateValueFromSiblings(grid.cells[2], 2)).to.equal(true);
      });
    });

    describe('checkIfSiblingsAcceptValue', () => {
      beforeEach(() => {
        grid.setSiblings();
      });

      it('Should call assignValue if only one sibling accepts the a value', () => {
        spy = chai.spy.on(grid, 'assignValue');

        let siblings = grid._siblings.get(grid.cells[0]);

        for (var i = 1; i < siblings.length; i++) {
          siblings[i]._possibleValues = [2, 3, 4, 5, 6, 7, 8, 9];
        }

        grid.checkIfSiblingsAcceptValue(grid.cells[0], 1);

        expect(spy).to.have.been.called.with(1, siblings[0]);
      });

      it('Should return false if it encounters any inconsistency', () => {
        let siblings = grid._siblings.get(grid.cells[0]);

        for (var i = 0; i < siblings.length; i++) {
          siblings[i]._possibleValues = [2, 3, 4, 5, 6, 7, 8, 9];
        }

        expect(grid.checkIfSiblingsAcceptValue(grid.cells[0], 1)).to.equal(false);
      });

      it('Should return true if it does not encounter any inconsistency', () => {
        expect(grid.checkIfSiblingsAcceptValue(grid.cells[0], 1)).to.equal(true);
      });
    });
  });
});