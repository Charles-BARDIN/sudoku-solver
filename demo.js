const sudoku = require('.');
const Grid = sudoku.Grid;
const Solver = sudoku.Solver;

let pattern = '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..';
let grid = new Grid(pattern);
let solver = new Solver();

console.log(`Grid:`);
grid.displayPattern();

let time = process.hrtime();
let diff;
let solved = solver.solve(grid);
diff = process.hrtime(time);

console.log(`Solved in ${Number(diff[0] * 1e3 + diff[1] / 1e6).toLocaleString()}ms`);
solved.displayGrid();