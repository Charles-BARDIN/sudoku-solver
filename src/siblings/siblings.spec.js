// TODO: Adapt tests to new Siblings class
// describe('getSiblings', () => {
//   it('Should call getRow', () => {
//     spy = chai.spy.on(grid, 'getRow');
//     cell = grid.cells[0];

//     grid.getSiblings(cell);

//     expect(spy).to.have.been.called.with(cell);
//   });

//   it('Should call getColumn', () => {
//     spy = chai.spy.on(grid, 'getColumn');
//     cell = grid.cells[0];

//     grid.getSiblings(cell);

//     expect(spy).to.have.been.called.with(cell);
//   });

//   it('Should call getSquare', () => {
//     spy = chai.spy.on(grid, 'getSquare');
//     cell = grid.cells[0];

//     grid.getSiblings(cell);

//     expect(spy).to.have.been.called.with(cell);
//   });

//   it('Should return an array of 20 cells', () => {
//     cell = grid.cells[0];
//     let siblings = grid.getSiblings(cell);

//     expect(siblings.length).to.equal(20);

//     for (let i = 0; i < siblings.length; i++) {
//       expect(siblings[i]).to.be.instanceOf(Cell);
//     }
//   });

//   it('Should return the 20 siblings', () => {
//     cell = grid.cells[40];
//     let siblings = grid.getSiblings(cell);

//     expect(siblings).to.have.members([
//       grid.cells[4],
//       grid.cells[13],
//       grid.cells[22],
//       grid.cells[31],
//       grid.cells[49],
//       grid.cells[58],
//       grid.cells[67],
//       grid.cells[76],
//       grid.cells[36],
//       grid.cells[37],
//       grid.cells[38],
//       grid.cells[39],
//       grid.cells[41],
//       grid.cells[42],
//       grid.cells[43],
//       grid.cells[44],
//       grid.cells[30],
//       grid.cells[32],
//       grid.cells[48],
//       grid.cells[50]
//     ]);
//   });
// });

// describe('getColumn', () => {
//   it('Should return an array of 8 cells', () => {
//     let column = grid.getColumn(grid.cells[0]);

//     expect(column.length).to.equal(8);

//     for (let i = 0; i < column.length; i++) {
//       expect(column[i]).to.be.instanceOf(Cell);
//     }
//   });

//   it('Should return the column of the cell', () => {
//     let column = grid.getColumn(grid.cells[41]);

//     expect(column).to.have.members([
//       grid.cells[5],
//       grid.cells[14],
//       grid.cells[23],
//       grid.cells[32],
//       grid.cells[50],
//       grid.cells[59],
//       grid.cells[68],
//       grid.cells[77]
//     ]);
//   });
// });

// describe('getRow', () => {
//   it('Should return an array of 8 cells', () => {
//     let row = grid.getRow(grid.cells[0]);

//     expect(row.length).to.equal(8);

//     for (let i = 0; i < row.length; i++) {
//       expect(row[i]).to.be.instanceOf(Cell);
//     }
//   });

//   it('Should return the column of the cell', () => {
//     let row = grid.getRow(grid.cells[42]);

//     expect(row).to.have.members([
//       grid.cells[36],
//       grid.cells[37],
//       grid.cells[38],
//       grid.cells[39],
//       grid.cells[40],
//       grid.cells[41],
//       grid.cells[43],
//       grid.cells[44],
//     ]);
//   });
// });

// describe('getSquare', () => {
//   it('Should return an array of 8 cells', () => {
//     let square = grid.getSquare(grid.cells[0]);

//     expect(square.length).to.equal(8);

//     for (let i = 0; i < square.length; i++) {
//       expect(square[i]).to.be.instanceOf(Cell);
//     }
//   });

//   it('Should return the square of the cell', () => {
//     let square = grid.getSquare(grid.cells[42]);

//     expect(square).to.have.members([
//       grid.cells[33],
//       grid.cells[34],
//       grid.cells[35],
//       grid.cells[43],
//       grid.cells[44],
//       grid.cells[51],
//       grid.cells[52],
//       grid.cells[53],
//     ]);
//   });
// });