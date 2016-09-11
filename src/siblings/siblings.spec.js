const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);

const Siblings = require('./siblings');
const Grid = require('../grid/grid');
const Cell = require('../cell/cell');

const pattern = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';
let siblings, grid, spy;

describe('Class: Siblings', () => {
  describe('Constructor', () => {
    describe('Parameter', () => {
      it('Should accept a Grid as a parameter', () => {
        expect(() => { new Siblings(new Grid(pattern)); }).not.to.throw();
      });

      it('Should throw an error if the parameter is not a Grid', () => {
        expect(() => { new Siblings(); }).to.throw(TypeError);
        expect(() => { new Siblings(1); }).to.throw(TypeError);
        expect(() => { new Siblings({}); }).to.throw(TypeError);
        expect(() => { new Siblings(true); }).to.throw(TypeError);
        expect(() => { new Siblings(''); }).to.throw(TypeError);
        expect(() => { new Siblings([]); }).to.throw(TypeError);
      });
    });

    describe('Properties', () => {
      beforeEach(() => {
        grid = new Grid(pattern);
        siblings = new Siblings(grid);
      });
      describe('grid', () => {
        it('Should be a Grid', () => {
          expect(siblings._grid).to.be.an.instanceof(Grid);
        });
      });

      describe('siblings', () => {
        it('Should be a Map', () => {
          expect(siblings._siblings).to.be.an.instanceof(Map);
        });

        it('Should give an array of 20 cells for every cell of the grid', () => {
          for (let i = 0, cell, sib; i < grid.cells.length; i++) {
            cell = grid.cells[i];
            sib = siblings._siblings.get(cell);

            expect(sib.length).to.equal(20);

            for (let j = 0; j < sib.length; j++) {
              expect(sib[j]).to.be.an.instanceof(Cell);
            }
          }
        });
      });
    });
  });

  describe('Methods', () => {
    beforeEach(() => {
      grid = new Grid(pattern);
      siblings = new Siblings(grid);
    });

    describe('Public', () => {
      describe('eliminateValueFromSiblings', () => {
        it('Should accept a Cell and a number as parameter', () => {
          expect(() => { siblings.eliminateValueFromSiblings(grid.cells[0], 1); }).to.not.throw();
        });

        it('Should throw an error if the parameters are not a Cell and a number', () => {
          expect(() => { grid.eliminateValueFromSiblings(grid.cells[0]); }).to.throw(TypeError);
          expect(() => { grid.eliminateValueFromSiblings(grid.cells[0], []); }).to.throw(TypeError);
          expect(() => { grid.eliminateValueFromSiblings(grid.cells[0], '1'); }).to.throw(TypeError);
          expect(() => { grid.eliminateValueFromSiblings(grid.cells[0], {}); }).to.throw(TypeError);
          expect(() => { grid.eliminateValueFromSiblings(null, 1); }).to.throw(TypeError);
          expect(() => { grid.eliminateValueFromSiblings([], 1); }).to.throw(TypeError);
          expect(() => { grid.eliminateValueFromSiblings('foo', 1); }).to.throw(TypeError);
          expect(() => { grid.eliminateValueFromSiblings({}, 1); }).to.throw(TypeError);
          expect(() => { grid.eliminateValueFromSiblings('bar', []); }).to.throw(TypeError);
          expect(() => { grid.eliminateValueFromSiblings([], {}); }).to.throw(TypeError);
          expect(() => { grid.eliminateValueFromSiblings(1, 'foobar'); }).to.throw(TypeError);
        });

        it('Should have eliminated the value from all the siblings', () => {
          siblings.eliminateValueFromSiblings(grid.cells[0], 1);
          let sib = siblings._siblings.get(grid.cells[0]);

          for (let i = 0; i < sib.length; i++) {
            expect(sib[i].possibleValues.indexOf(1)).to.equal(-1);
          }
        });

        it('Should call the isSolved method twice for every siblings', () => {
          spy = [];
          let sib = siblings._siblings.get(grid.cells[0]);

          for (let i = 0; i < sib.length; i++) {
            spy.push(chai.spy.on(sib[i], 'isSolved'));
          }

          siblings.eliminateValueFromSiblings(grid.cells[0], 1);

          for (let i = 0; i < sib.length; i++) {
            expect(spy[i]).to.have.been.called();
          }
        });

        it('Should call its method eliminateValueFromSiblings for every cell that got solved', () => {
          let sib = siblings._siblings.get(grid.cells[0]);

          sib[0]._possibleValues = [1, 2];

          spy = chai.spy.on(siblings, 'eliminateValueFromSiblings');

          siblings.eliminateValueFromSiblings(grid.cells[0], 1);

          expect(spy).to.have.been.called.with(sib[0], 2)
        });
      });

      describe('checkIfSiblingsAcceptValue', () => {
        it('Should accept a Cell and a number as parameter', () => {
          expect(() => { siblings.checkIfSiblingsAcceptValue(grid.cells[0], 1); }).to.not.throw();
        });

        it('Should throw an error if the parameters are not a Cell and a number', () => {
          expect(() => { grid.checkIfSiblingsAcceptValue(grid.cells[0]); }).to.throw(TypeError);
          expect(() => { grid.checkIfSiblingsAcceptValue(grid.cells[0], []); }).to.throw(TypeError);
          expect(() => { grid.checkIfSiblingsAcceptValue(grid.cells[0], '1'); }).to.throw(TypeError);
          expect(() => { grid.checkIfSiblingsAcceptValue(grid.cells[0], {}); }).to.throw(TypeError);
          expect(() => { grid.checkIfSiblingsAcceptValue(null, 1); }).to.throw(TypeError);
          expect(() => { grid.checkIfSiblingsAcceptValue([], 1); }).to.throw(TypeError);
          expect(() => { grid.checkIfSiblingsAcceptValue('foo', 1); }).to.throw(TypeError);
          expect(() => { grid.checkIfSiblingsAcceptValue({}, 1); }).to.throw(TypeError);
          expect(() => { grid.checkIfSiblingsAcceptValue('bar', []); }).to.throw(TypeError);
          expect(() => { grid.checkIfSiblingsAcceptValue([], {}); }).to.throw(TypeError);
          expect(() => { grid.checkIfSiblingsAcceptValue(1, 'foobar'); }).to.throw(TypeError);
        });

        it('Should call the acceptsValue method of every siblings', () => {
          let sib = siblings._siblings.get(grid.cells[0]);
          spy = [];

          for (let i = 0; i < sib.length; i++) {
            spy.push(chai.spy.on(sib[i], 'acceptsValue'));
          }

          siblings.checkIfSiblingsAcceptValue(grid.cells[0], 1);

          for (let i = 0; i < spy.length; i++) {
            expect(spy[i]).to.have.been.called.with(1);
          }
        });

        it('Should return an array of the cells that accepts the value', () => {
          let sib = siblings._siblings.get(grid.cells[0]);
          for (let i = 2; i < sib.length; i++) {
            sib[i]._possibleValues = [2, 3, 4, 5, 6, 7, 8, 9];
          }

          let res = siblings.checkIfSiblingsAcceptValue(grid.cells[0], 1);

          expect(res).to.have.members([
            sib[0],
            sib[1]
          ]);
        });
      });
    });

    describe('Private', () => {
      describe('getCellSiblings', () => {
        it('Should accept a Cell as a parameter', () => {
          expect(() => { siblings._getCellSiblings(grid.cells[0]); }).to.not.throw();
        });

        it('Should throw an error if the parameter is not a Cell', () => {
          expect(() => { siblings._getCellSiblings(); }).to.throw(TypeError);
          expect(() => { siblings._getCellSiblings(1); }).to.throw(TypeError);
          expect(() => { siblings._getCellSiblings({}); }).to.throw(TypeError);
          expect(() => { siblings._getCellSiblings(true); }).to.throw(TypeError);
          expect(() => { siblings._getCellSiblings(''); }).to.throw(TypeError);
          expect(() => { siblings._getCellSiblings([]); }).to.throw(TypeError);
        });

        it('Should call its private methods getRow, getColumn and getSquare', () => {
          spy = [
            chai.spy.on(siblings, '_getRow'),
            chai.spy.on(siblings, '_getColumn'),
            chai.spy.on(siblings, '_getSquare'),
          ];

          siblings._getCellSiblings(grid.cells[0]);

          expect(spy[0]).to.have.been.called.with(grid.cells[0]);
          expect(spy[0]).to.have.been.called.with(grid.cells[1]);
          expect(spy[0]).to.have.been.called.with(grid.cells[2]);
        });

        it('Should return an array of 20 Cells', () => {
          let sib = siblings._getCellSiblings(grid.cells[0]);

          expect(sib.length).to.equal(20);

          for (let i = 0; i < sib.length; i++) {
            expect(sib[i]).to.be.an.instanceof(Cell);
          }
        });

        it('Should return the 20 siblings of the cell', () => {
          let sib = siblings._getCellSiblings(grid.cells[40]);

          expect(sib).to.have.members([
            grid.cells[4],
            grid.cells[13],
            grid.cells[22],
            grid.cells[31],
            grid.cells[49],
            grid.cells[58],
            grid.cells[67],
            grid.cells[76],
            grid.cells[36],
            grid.cells[37],
            grid.cells[38],
            grid.cells[39],
            grid.cells[41],
            grid.cells[42],
            grid.cells[43],
            grid.cells[44],
            grid.cells[30],
            grid.cells[32],
            grid.cells[48],
            grid.cells[50]
          ]);
        });
      });

      describe('getColumn', () => {
        it('Should accept a Cell as a parameter', () => {
          expect(() => { siblings._getColumn(grid.cells[0]); }).to.not.throw();
        });

        it('Should throw an error if the parameter is not a Cell', () => {
          expect(() => { siblings._getColumn(); }).to.throw(TypeError);
          expect(() => { siblings._getColumn(1); }).to.throw(TypeError);
          expect(() => { siblings._getColumn({}); }).to.throw(TypeError);
          expect(() => { siblings._getColumn(true); }).to.throw(TypeError);
          expect(() => { siblings._getColumn(''); }).to.throw(TypeError);
          expect(() => { siblings._getColumn([]); }).to.throw(TypeError);
        });

        it('Should return an array of 8 Cells', () => {
          let col = siblings._getColumn(grid.cells[0]);

          expect(col.length).to.equal(8);

          for (let i = 0; i < col.length; i++) {
            expect(col[i]).to.be.an.instanceof(Cell);
          }
        });

        it('Should return the 8 cells composing the column of the cell', () => {
          let col = siblings._getColumn(grid.cells[0]);

          expect(col).to.have.members([
            grid.cells[9],
            grid.cells[18],
            grid.cells[27],
            grid.cells[36],
            grid.cells[45],
            grid.cells[54],
            grid.cells[63],
            grid.cells[72]
          ]);
        });
      });

      describe('getRow', () => {
        it('Should accept a Cell as a parameter', () => {
          expect(() => { siblings._getRow(grid.cells[0]); }).to.not.throw();
        });

        it('Should throw an error if the parameter is not a Cell', () => {
          expect(() => { siblings._getRow(); }).to.throw(TypeError);
          expect(() => { siblings._getRow(1); }).to.throw(TypeError);
          expect(() => { siblings._getRow({}); }).to.throw(TypeError);
          expect(() => { siblings._getRow(true); }).to.throw(TypeError);
          expect(() => { siblings._getRow(''); }).to.throw(TypeError);
          expect(() => { siblings._getRow([]); }).to.throw(TypeError);
        });

        it('Should return an array of 8 Cells', () => {
          let row = siblings._getRow(grid.cells[0]);

          expect(row.length).to.equal(8);

          for (let i = 0; i < row.length; i++) {
            expect(row[i]).to.be.an.instanceof(Cell);
          }
        });

        it('Should return the 8 cells composing the row of the cell', () => {
          let row = siblings._getRow(grid.cells[0]);

          expect(row).to.have.members([
            grid.cells[1],
            grid.cells[2],
            grid.cells[3],
            grid.cells[4],
            grid.cells[5],
            grid.cells[6],
            grid.cells[7],
            grid.cells[8]
          ]);
        });
      });

      describe('getSquare', () => {
        it('Should accept a Cell as a parameter', () => {
          expect(() => { siblings._getSquare(grid.cells[0]); }).to.not.throw();
        });

        it('Should throw an error if the parameter is not a Cell', () => {
          expect(() => { siblings._getSquare(); }).to.throw(TypeError);
          expect(() => { siblings._getSquare(1); }).to.throw(TypeError);
          expect(() => { siblings._getSquare({}); }).to.throw(TypeError);
          expect(() => { siblings._getSquare(true); }).to.throw(TypeError);
          expect(() => { siblings._getSquare(''); }).to.throw(TypeError);
          expect(() => { siblings._getSquare([]); }).to.throw(TypeError);
        });

        it('Should return an array of 8 Cells', () => {
          let sqr = siblings._getSquare(grid.cells[0]);

          expect(sqr.length).to.equal(8);

          for (let i = 0; i < sqr.length; i++) {
            expect(sqr[i]).to.be.an.instanceof(Cell);
          }
        });

        it('Should return the 8 cells composing the square of the cell', () => {
          let sqr = siblings._getSquare(grid.cells[0]);

          expect(sqr).to.have.members([
            grid.cells[1],
            grid.cells[2],
            grid.cells[9],
            grid.cells[10],
            grid.cells[11],
            grid.cells[18],
            grid.cells[19],
            grid.cells[20]
          ]);
        });
      });
    });
  });
});