const expect = require('chai').expect;

require('../polyfills');

const Solver = require('./solver');
const Grid = require('../grid/grid');
const Cell = require('../cell/cell');

let pattern = '..3.2.6..9..3.5..1..18.64....81.29..7.......8..67.82....26.95..8..2.3..9..5.1.3..';
let pattern_hard = '..53.....8......2..7..1.5..4....53...1..7...6..32...8..6.5....9..4....3......97..';

describe('Class: Solver', () => {
  describe('Methods', () => {
    describe('setGridValues', () => {
      it('Should have set all the values from the pattern on the grid', () => {
        let grid = new Grid(pattern_hard);

        let solver = new Solver(grid);

        solver.setGridValues();

        for (let i = 0, digit; i < grid.cells.length; i++) {
          digit = Number(pattern_hard[i]);

          if (isNaN(digit) || digit === 0) {
            continue;
          }
          expect(grid.cells[i].value).to.equal(digit);
        }
      });

      it('Should resolve an easy grid', () => {
        let grid = new Grid(pattern);

        let solver = new Solver(grid);

        solver.setGridValues();

        for (let i = 0, digit; i < grid.cells.length; i++) {
          digit = Number(pattern[i]);

          if (digit) {
            expect(grid.cells[i].value).to.equal(digit);
          }
          expect(grid.cells[i].isSolved()).to.equal(true);
        }
      });
    });

    describe('search', () => {
      it('Should resolve a hard grid', () => {
        let grid = new Grid(pattern_hard);

        let solver = new Solver(grid);

        solver.search(solver.setGridValues());

        for (let i = 0, digit; i < solver._grid.cells.length; i++) {
          digit = Number(pattern_hard[i]);

          if (digit) {
            expect(solver._grid.cells[i].value).to.equal(digit);
          }
          expect(solver._grid.cells[i].isSolved()).to.equal(true);
        }
      });
    });

    describe('solve', () => {

    });
  });
});