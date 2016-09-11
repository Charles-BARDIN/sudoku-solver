const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);

require('../polyfills/polyfills');

const Grid = require('./grid');
const Cell = require('../cell/cell');

const pattern = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';
const pattern_number = [0, 0, 3, 0, 2, 0, 6, 0, 0, 9, 0, 0, 3, 0, 5, 0, 0, 1, 0, 0, 1, 8, 0, 6, 4, 0, 0, 0, 0, 8, 1, 0, 2, 9, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 6, 7, 0, 8, 2, 0, 0, 0, 0, 2, 6, 0, 9, 5, 0, 0, 8, 0, 0, 2, 0, 3, 0, 0, 9, 0, 0, 5, 0, 1, 0, 3, 0, 0];
const bad_array = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
const pattern_solved = '586327491721945368943681725154796832872134956369258174235819647417563289698472513';
let grid, spy;

describe('Class: Grid', () => {
  describe('Constructor', () => {
    describe('Parameter', () => {
      it('Should accept a string of 81 chars', () => {
        expect(() => { new Grid(pattern); }).to.not.throw();
      });

      it('Should accept an array of 81 chars', () => {
        expect(() => { new Grid(pattern.split('')); }).to.not.throw();
      });

      it('Should accept an array of 81 numbers', () => {
        expect(() => { new Grid(pattern_number); }).to.not.throw();
      });

      it('Should throw an error if the parameter is not a string or an array', () => {
        expect(() => { new Grid(); }).to.throw(TypeError);
        expect(() => { new Grid(1); }).to.throw(TypeError);
        expect(() => { new Grid({}); }).to.throw(TypeError);
        expect(() => { new Grid(true); }).to.throw(TypeError);
      });

      it('Should throw an error if the parameter is not 81 long', () => {
        expect(() => { new Grid([1, 0]); }).to.throw(RangeError);
        expect(() => { new Grid('132'); }).to.throw(RangeError);
      });

      it('Should throw an error if the parameter is an array not composed of strings or numbers', () => {
        expect(() => { new Grid(bad_array); }).to.throw(TypeError);
      });

      it('Should throw an error if the parameter is an array composed of strings of more than one char', () => {
        let pat = pattern.split('');
        pat[0] += '1';

        expect(() => { new Grid(pat); }).to.throw(TypeError);
      });
    });


    describe('Properties', () => {
      beforeEach(() => {
        grid = new Grid(pattern);
      });

      describe('cells', () => {
        it('Should be defined', () => {
          expect(grid.cells).to.not.be.undefined;
        });

        it('Should be an array of 81 Cells', () => {
          expect(grid.cells.length).to.equal(81);

          for (let i = 0; i < grid.cells.length; i++) {
            expect(grid.cells[i]).to.be.an.instanceof(Cell);
          }
        });
      });

      describe('pattern', () => {
        it('Should be defined', () => {
          expect(grid.pattern).to.not.be.undefined;
        });

        it('Should be a string of 81 chars', () => {
          expect(grid.pattern).to.be.a('string');
          expect(grid.pattern.length).to.equal(81);
        });
      });

      describe('siblings', () => {
        it('Should be null', () => {
          expect(grid.siblings).to.be.null;
        });
      });
    });
  });

  describe('Methods', () => {
    beforeEach(() => {
      grid = new Grid(pattern);
    });

    describe('Public', () => {
      describe('isSolved', () => {
        it('Should return true if the grid is solved', () => {
          grid._pattern = pattern_solved;
          for (var i = 0; i < pattern_solved.length; i++) {
            grid.cells[i]._possibleValues = [pattern_solved[i]];
            grid.cells[i]._value = pattern_solved[i];
          }

          expect(grid.isSolved()).to.be.true;
        });

        it('Should return false if the grid is not solved', () => {
          expect(grid.isSolved()).to.be.false;
        });
      });

      describe('assignValue', () => {
        it('Should accept a number and a Cell as parameters', () => {
          expect(() => { grid.assignValue(grid.cells[0], 1); }).to.not.throw();
        });

        it('Should throw an error if the parameters are not a number and a Cell', () => {
          expect(() => { grid.assignValue(grid.cells[0]); }).to.throw(TypeError);
          expect(() => { grid.assignValue(grid.cells[0], []); }).to.throw(TypeError);
          expect(() => { grid.assignValue(grid.cells[0], '1'); }).to.throw(TypeError);
          expect(() => { grid.assignValue(grid.cells[0], {}); }).to.throw(TypeError);
          expect(() => { grid.assignValue(null, 1); }).to.throw(TypeError);
          expect(() => { grid.assignValue([], 1); }).to.throw(TypeError);
          expect(() => { grid.assignValue('foo', 1); }).to.throw(TypeError);
          expect(() => { grid.assignValue({}, 1); }).to.throw(TypeError);
          expect(() => { grid.assignValue('bar', []); }).to.throw(TypeError);
          expect(() => { grid.assignValue([], {}); }).to.throw(TypeError);
          expect(() => { grid.assignValue(1, 'foobar'); }).to.throw(TypeError);
        });

        it('Should have assigned the value to the cell', () => {
          grid.assignValue(grid.cells[0], 1);

          expect(grid.cells[0].isSolved()).to.be.true;
          expect(grid.cells[0].value).to.equal(1);
          expect(grid.cells[0].possibleValues).to.have.members([1]);
        });

        it('Should call its private method eliminateValueFromCell with all the other possible values', () => {
          spy = chai.spy.on(grid, '_eliminateValueFromCell');
          grid.assignValue(grid.cells[0], 1);

          expect(spy).to.have.been.called.with(grid.cells[0], 2);
          expect(spy).to.have.been.called.with(grid.cells[0], 3);
          expect(spy).to.have.been.called.with(grid.cells[0], 4);
          expect(spy).to.have.been.called.with(grid.cells[0], 5);
          expect(spy).to.have.been.called.with(grid.cells[0], 6);
          expect(spy).to.have.been.called.with(grid.cells[0], 7);
          expect(spy).to.have.been.called.with(grid.cells[0], 8);
          expect(spy).to.have.been.called.with(grid.cells[0], 9);

        });

        it('Should return null if the value to assign does not belong to the possible values of the cell', () => {
          grid.cells[0]._possibleValues = [2, 3, 4, 5, 6, 7, 8, 9];

          expect(grid.assignValue(grid.cells[0], 1)).to.be.null;
        });

        it('Should return itself if it did not encounter any inconsistencies', () => {
          expect(grid.assignValue(grid.cells[0], 1)).to.equal(grid);
        });
      });
    });

    describe('Private', () => {
      describe('setSiblings', () => {
        it('Should have set the grid\'s siblings', () => {
          grid._setSiblings();

          expect(grid._siblings).to.not.be.null;
        });
      });

      describe('eliminateValueFromCell', () => {
        it('Should accept a number and a cell as a parameter', () => {
          expect(() => { grid._eliminateValueFromCell(grid.cells[0], 1); }).to.not.throw();
        });

        it('Should throw an error if the parameters are not a number and a cell', () => {
          expect(() => { grid._eliminateValueFromCell(grid.cells[0]); }).to.throw(TypeError);
          expect(() => { grid._eliminateValueFromCell(grid.cells[0], []); }).to.throw(TypeError);
          expect(() => { grid._eliminateValueFromCell(grid.cells[0], '1'); }).to.throw(TypeError);
          expect(() => { grid._eliminateValueFromCell(grid.cells[0], {}); }).to.throw(TypeError);
          expect(() => { grid._eliminateValueFromCell(null, 1); }).to.throw(TypeError);
          expect(() => { grid._eliminateValueFromCell([], 1); }).to.throw(TypeError);
          expect(() => { grid._eliminateValueFromCell('foo', 1); }).to.throw(TypeError);
          expect(() => { grid._eliminateValueFromCell({}, 1); }).to.throw(TypeError);
          expect(() => { grid._eliminateValueFromCell('bar', []); }).to.throw(TypeError);
          expect(() => { grid._eliminateValueFromCell([], {}); }).to.throw(TypeError);
          expect(() => { grid._eliminateValueFromCell(1, 'foobar'); }).to.throw(TypeError);
        });

        it('Should call the isSolved method of the cell', () => {
          spy = chai.spy.on(grid.cells[0], 'isSolved');

          grid._eliminateValueFromCell(grid.cells[0], 1);

          expect(spy).to.have.been.called();
        });

        it('Should call its private method setSiblings', () => {
          spy = chai.spy.on(grid, '_setSiblings');

          grid._eliminateValueFromCell(grid.cells[0], 1);

          expect(spy).to.have.been.called();
        });

        it('Should call the eliminateValueFromSiblings method of its siblings if the cell is solved', () => {
          grid._setSiblings();
          spy = chai.spy.on(grid._siblings, 'eliminateValueFromSiblings');
          grid._cells[0]._possibleValues = [1, 2];

          grid._eliminateValueFromCell(grid.cells[0], 1);

          expect(grid.cells[0].isSolved()).to.be.true;
          expect(spy).to.have.been.called.with(grid.cells[0], 2);
        });

        it('Should call the checkValueForSiblings private method', () => {
          spy = chai.spy.on(grid, '_checkValueForSiblings');

          grid._eliminateValueFromCell(grid.cells[0], 1);

          expect(spy).to.have.been.called.with(grid.cells[0], 1);
        });

        it('Should have eliminated the value from the cell\'s possible values', () => {
          grid._eliminateValueFromCell(grid.cells[0], 1);

          expect(grid.cells[0].possibleValues).to.have.members([2, 3, 4, 5, 6, 7, 8, 9]);
        });

        it('Should return null if it has occured any inconsistencies', () => {
          grid.cells[0]._possibleValues = [1];
          grid.cells[0]._value = 1;

          expect(grid._eliminateValueFromCell(grid.cells[0], 1)).to.be.null;
        });

        it('Should return true if it has not occured any inconsistencies', () => {
          expect(grid._eliminateValueFromCell(grid.cells[0], 1)).to.be.true;
        });
      });

      describe('checkValueForSiblings', () => {
        beforeEach(() => {
          grid._setSiblings();
        });

        it('Should accept a Cell and a number as parameters', () => {
          expect(() => { grid._checkValueForSiblings(grid.cells[0], 1); }).to.not.throw();
        });

        it('Should throw an error if the parameters are not a Cell and a number', () => {
          expect(() => { grid._checkValueForSiblings(grid.cells[0]); }).to.throw(TypeError);
          expect(() => { grid._checkValueForSiblings(grid.cells[0], []); }).to.throw(TypeError);
          expect(() => { grid._checkValueForSiblings(grid.cells[0], '1'); }).to.throw(TypeError);
          expect(() => { grid._checkValueForSiblings(grid.cells[0], {}); }).to.throw(TypeError);
          expect(() => { grid._checkValueForSiblings(null, 1); }).to.throw(TypeError);
          expect(() => { grid._checkValueForSiblings([], 1); }).to.throw(TypeError);
          expect(() => { grid._checkValueForSiblings('foo', 1); }).to.throw(TypeError);
          expect(() => { grid._checkValueForSiblings({}, 1); }).to.throw(TypeError);
          expect(() => { grid._checkValueForSiblings('bar', []); }).to.throw(TypeError);
          expect(() => { grid._checkValueForSiblings([], {}); }).to.throw(TypeError);
          expect(() => { grid._checkValueForSiblings(1, 'foobar'); }).to.throw(TypeError);
        });

        it('Should call the checkIfSiblingsAcceptValue of its siblings', () => {
          spy = chai.spy.on(grid._siblings, 'checkIfSiblingsAcceptValue');

          grid._checkValueForSiblings(grid.cells[0], 1);

          expect(spy).to.have.been.called.with(grid.cells[0], 1);
        });

        it('Should call its assignValue method if only one sibling accepts', () => {
          let siblings = grid._siblings._siblings.get(grid.cells[0]);
          spy = chai.spy.on(grid, 'assignValue');

          for (let i = 1; i < siblings.length; i++) {
            siblings[i]._possibleValues = [2, 3, 4, 5, 6, 7, 8, 9];
          }

          expect(grid._siblings.checkIfSiblingsAcceptValue(grid.cells[0], 1).length).to.equal(1);

          grid._checkValueForSiblings(grid.cells[0], 1);

          expect(spy).to.have.been.called.with(siblings[0], 1);
        });

        it('Shouls return true if it has not occured any inconsistencies', () => {
          expect(grid._checkValueForSiblings(grid.cells[0], 1)).to.be.true;
        });

        it('Should return null if it has occured any inconsistencies', () => {
          let siblings = grid._siblings._siblings.get(grid.cells[0]);

          for (let i = 0; i < siblings.length; i++) {
            siblings[i]._possibleValues = [2, 3, 4, 5, 6, 7, 8, 9];
          }

          expect(grid._checkValueForSiblings(grid.cells[0], 1)).to.be.null;
        });
      });
    });

    describe('Static', () => {
      describe('copy', () => {
        it('Should accept a Grid as a parameter', () => {
          expect(() => { Grid.copy(grid); }).to.not.throw();
        });

        it('Should throw an error if the parameter is not a Grid', () => {
          expect(() => { Grid.copy(); }).to.throw(TypeError);
          expect(() => { Grid.copy(1); }).to.throw(TypeError);
          expect(() => { Grid.copy({}); }).to.throw(TypeError);
          expect(() => { Grid.copy(true); }).to.throw(TypeError);
        });

        it('Should return a copy of the grid', () => {
          let _grid = Grid.copy(grid);

          expect(grid.pattern).to.equal(_grid.pattern);

          for (let i = 0, cell, _cell; i < grid.cells.length; i++) {
            cell = grid.cells[i];
            _cell = _grid.cells[i];

            expect(cell.value).to.equal(_cell.value);
            expect(cell.possibleValues).to.have.members(_cell.possibleValues);
          }
        });
      });
    });
  });
});