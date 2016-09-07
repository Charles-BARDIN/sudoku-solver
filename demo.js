const sudoku = require('.');
const Grid = sudoku.Grid;
const Solver = sudoku.Solver;

let pattern = '..53.....8......2..7..1.5..4....53...1..7...6..32...8..6.5....9..4....3......97..';
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