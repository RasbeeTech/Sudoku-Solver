# Sudoku-Solver
API service for solving sudoku puzzles.  

### Purpose:
Practice implementing unit and integrated Mocha Chai-HTTP testing.  
 
 ### Usage examples:
 Input puzzle:  
```
POST api/solve {puzzle: puzzle_string}
```
Validate puzzle piece:  
```
POST api/check {puzzle: puzzle_string, coordinate: 'A1', value: 9}
```
 ### Return example:
```
{solution: solved_puzzle_string}
```
