const expect = require('chai').expect;
const Solver = require('./solver');
const Grid = require('../grid/grid');

const pattern = '..3.2.6..9..3.5..1..18.64....81.29..7.......8..67.82....26.95..8..2.3..9..5.1.3..';
const pattern_hard = '..53.....8......2..7..1.5..4....53...1..7...6..32...8..6.5....9..4....3......97..';
const pattern_bad = '11...............................................................................';

let solver, grid, hard_grid;

describe('Class: Solver', () => {
  describe('Methods', () => {
    beforeEach(() => {
      solver = new Solver();
      grid = new Grid(pattern);
    });

    describe('Public', () => {
      describe('solve', () => {
        it('Should accept a grid as a parameter', () => {
          expect(() => { solver.solve(grid); }).to.not.throw();
        });

        it('Should throw an error if the parameter is not a grid', () => {
          expect(() => { solver.solve(1); }).to.throw(TypeError);
          expect(() => { solver.solve('1'); }).to.throw(TypeError);
          expect(() => { solver.solve([1]); }).to.throw(TypeError);
          expect(() => { solver.solve({}); }).to.throw(TypeError);
          expect(() => { solver.solve(); }).to.throw(TypeError);
        });

        it('Should return null if the grid is not solvable', () => {
          expect(solver.solve(new Grid(pattern_bad))).to.be.null;
        });

        it('Should solve any grids', () => {
          let _grid = solver.solve(grid);
          expect(_grid.isSolved()).to.be.true;

          for (let i = 0; i < pattern.length; i++) {
            if (!(isNaN(Number(pattern[i])))) {
              expect(Number(pattern[i])).to.equal(_grid.cells[i].value);
            }
          }

          _grid = solver.solve(new Grid(pattern_hard));
          expect(_grid.isSolved()).to.be.true;

          for (let i = 0; i < pattern_hard.length; i++) {
            if (!(isNaN(Number(pattern_hard[i])))) {
              expect(Number(pattern_hard[i])).to.equal(_grid.cells[i].value);
            }
          }
        });
      });
    });

    describe('Private', () => {
      describe('setPatternValues', () => {
        it('Should accept a grid as a parameter', () => {
          expect(() => { solver._setPatternValues(grid); }).to.not.throw();
        });

        it('Should throw an error if the parameter is not a grid', () => {
          expect(() => { solver._setPatternValues(1); }).to.throw(TypeError);
          expect(() => { solver._setPatternValues('1'); }).to.throw(TypeError);
          expect(() => { solver._setPatternValues([1]); }).to.throw(TypeError);
          expect(() => { solver._setPatternValues({}); }).to.throw(TypeError);
          expect(() => { solver._setPatternValues(); }).to.throw(TypeError);
        });

        it('Should return null if the pattern has any inconsistency', () => {
          expect(solver._setPatternValues(new Grid(pattern_bad))).to.be.null;
        });

        it('Should have assigned all the values from the pattern', () => {
          solver._setPatternValues(grid);

          for (let i = 0; i < pattern.length; i++) {
            if (!(isNaN(Number(pattern[i])))) {
              expect(Number(pattern[i])).to.equal(grid.cells[i].value);
            }
          }
        });

        it('Should have guessed some values', () => {
          let _grid = solver._setPatternValues(new Grid('12345678.........................................................................'));

          expect(_grid.cells[8].value).to.equal(9);
          expect(_grid.cells[8].isSolved()).to.be.true;
        });

        it('Should resolve a simple grid', () => {
          let _grid = solver._setPatternValues(grid);
          expect(_grid.isSolved()).to.be.true;
        });
      });

      describe('search', () => {
        it('Should accept a grid as a parameter', () => {
          expect(() => { solver._search(grid); }).to.not.throw();
        });

        it('Should throw an error if the parameter is given and is not a grid', () => {
          expect(() => { solver._search(1); }).to.throw(TypeError);
          expect(() => { solver._search('1'); }).to.throw(TypeError);
          expect(() => { solver._search([1]); }).to.throw(TypeError);
          expect(() => { solver._search({}); }).to.throw(TypeError);
        });

        it('Should solve any solvable grids', () => {
          hard_grid = new Grid(pattern_hard);

          expect(solver._search(grid)).to.be.an.instanceof(Grid);
          expect(solver._search(hard_grid)).to.be.an.instanceof(Grid);

          expect(solver._search(grid).isSolved()).to.be.true;
          expect(solver._search(hard_grid).isSolved()).to.be.true;
        });

        it('Should return null if parameter is not given', () => {
          expect(solver._search()).to.be.null;
          expect(solver._search(undefined)).to.be.null;
          expect(solver._search(null)).to.be.null;
        });
      });
    });
  });
});