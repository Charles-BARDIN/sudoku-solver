const sudoku = require('.');
const Grid = sudoku.Grid;
const Solver = sudoku.Solver;

let pattern = '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..';
let grid = new Grid(pattern);
let solver = new Solver();

console.log(`Grid:`);
displayAsAGrid(grid.pattern);

let time = process.hrtime();
let diff;
let solved = solver.solve(grid);
diff = process.hrtime(time);

console.log(`Solved in ${Number(diff[0] * 1e3 + diff[1] / 1e6).toLocaleString()}ms`);
displayAsAGrid(solved.cells);

function displayAsAGrid(item) {
  let type = 'Cell[]';
  if (typeof item === 'string') {
    type = 'string';
  }

  let output = '';
  let divider = '\n------ ------- ------\n';

  let last = item.length - 1;
  for (let i = 0, cell; i < (last + 1); i++) {
    cell = item[i];

    if (type === 'string') {
      output += Number(cell) ? cell : '.';
    } else {
      output += (cell.value) ? (cell.value) : ('.');
    }

    output += ' ';

    if ((i % 27 === 26) && (i !== last)) {
      output += divider;
    } else if (i % 9 === 8) {
      output += '\n';
    } else if (i % 3 === 2) {
      output += '| ';
    }
  }
  console.log(output);
}