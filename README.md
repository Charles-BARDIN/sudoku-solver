# sudoku-solver

This repository is a sudoku solver written in ES6. 

## How to use
The module can be used like this
```js
const sudoku = require('./local/path/to/sudoku-solver');
const Grid = sudoku.Grid;
const Solver = sudoku.Solver;
const pattern = '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..';

// Creates a new Grid
let grid = new Grid(pattern);
// Creates a Solver
let solver = new Solver();
let solved_grid;

// Displays the pattern as a grid
grid.displayPattern();

// Solves the grid
solved_grid = solver.solve(grid);

// Displays the grid
solved_grid.displayGrid();
```

## Demo
To launch the demo, run
```
git clone https://github.com/Charles-BARDIN/sudoku-solver.git
npm run demo
```
The console will log
```
Grid:                                                                                                                                                                                                             
8 . . | . . . | . . .                                                                                                                                                                                             
. . 3 | 6 . . | . . .                                                                                                                                                                                             
. 7 . | . 9 . | 2 . .                                                                                                                                                                                             
------ ------- ------                                                                                                                                                                                             
. 5 . | . . 7 | . . .                                                                                                                                                                                             
. . . | . 4 5 | 7 . .                                                                                                                                                                                             
. . . | 1 . . | . 3 .                                                                                                                                                                                             
------ ------- ------                                                                                                                                                                                             
. . 1 | . . . | . 6 8                                                                                                                                                                                             
. . 8 | 5 . . | . 1 .                                                                                                                                                                                             
. 9 . | . . . | 4 . .                                                                                                                                                                                             
                                                                                                                                                                                                                  
Solved in 1,340.255ms                                                                                                                                                                                             
8 1 2 | 7 5 3 | 6 4 9                                                                                                                                                                                             
9 4 3 | 6 8 2 | 1 7 5                                                                                                                                                                                             
6 7 5 | 4 9 1 | 2 8 3                                                                                                                                                                                             
------ ------- ------                                                                                                                                                                                             
1 5 4 | 2 3 7 | 8 9 6                                                                                                                                                                                             
3 6 9 | 8 4 5 | 7 2 1                                                                                                                                                                                             
2 8 7 | 1 6 9 | 5 3 4                                                                                                                                                                                             
------ ------- ------                                                                                                                                                                                             
5 2 1 | 9 7 4 | 3 6 8                                                                                                                                                                                             
4 3 8 | 5 2 6 | 9 1 7                                                                                                                                                                                             
7 9 6 | 3 1 8 | 4 5 2 
```

The grid from the demo comes from [here](http://puzzling.stackexchange.com/questions/252/how-do-i-solve-the-worlds-hardest-sudoku).

## Tests
To launch the tests, run

```
npm install
npm test
```

## Algorithm
The algorithm is in two parts:
* assign the values from the pattern to the grid
* search the values for the cells that are not solved

### Vocabulary
Here are the definitions of the terms used in this program: 

#### grid 
A 9 x 9 sudoku grid

#### cell
A grid is composed of 81 cells that can have an integer value between 1 and 9 included

#### sibling
A sibling of a cell is a cell that belongs to the same row, column or square

#### square
A grid is composed of 9 squares that are 3 x 3 subgrids

#### solved
A cell is solved if its value is determinated. A grid is solved if all its cell are solved 

### Assigning value
In this part of the algorithm, the values from the pattern are assigned to the grid. This is suffiscent to complete the simplest sudoku grids.

To assign a value to a cell, it actually removes all the other possible values of the cell.
Each time a value is removed, it checks if it permits to assign a value to a sibling by looking if only one sibling can accept the value

Each time a value is assigned to a cell, it is removed from the possible values of the siblings. If a sibling has only one possible value, the value is assigned to the sibling.

If the algorithm encounter any inconsistencies when assigning a value, it will return null.

### Searching for missing values
If the first part of the algorithm have not solved the grid, it will search for missing values.

It checks which cell has the minimum possible values. 

Then, it tries to assign the first value using the first part of the algorithm.

If it returns null, it means an inconsistency has been encountered. It then tries with the second value, etc.
If it returns a grid, it means this value was assigned with success. 

If the grid is not solved, it will use this part of the algorithm to search for the other values. Otherwise it is done.
