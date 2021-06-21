class SudokuSolver {

  validate(puzzleString) {
    /* 
      Check if puzzeString is of valid length and valid characters:
        returns false if invalid,
        returns true if valid.
    */
    return /^[0-9.]*$/.test(puzzleString) && puzzleString.length == 81;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    /*
      Check if value is valid in row:
        returns false if value already exists in row,
        returns true if value does not exist in row.
    */
    let rowStart = 9 * (row.toLowerCase().charCodeAt(0) - 97);
    let rowEnd = rowStart + 9;
    return !puzzleString.slice(rowStart, rowEnd).includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {
    
  }
}

module.exports = SudokuSolver;

