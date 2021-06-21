class SudokuSolver {

  validate(puzzleString) {
    /* 
      Check if puzzeString is of valid characters:
        returns false if invalid,
        returns true if valid.
    */
    return !/^[0-9.]*$/.test(puzzleString);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    /*
      Check if value is valid in row:
        returns true if value does not exist in row.
        returns false if value already exists in row,
    */
    let rowStart = 9 * (row.toLowerCase().charCodeAt(0) - 97);
    let rowEnd = rowStart + 9;
    return !puzzleString.slice(rowStart, rowEnd).includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    /*
      Check if value is valid in column.
        returns true if value does not exist in column.
        returns false if value already exists in column.
    */
    let colStart = Number(column) - 1;
    let colEnd = colStart + 72;
    let col = '';
    for(let i = colStart; i <= colEnd; i = i + 9){
      col = col + String(puzzleString.charAt(i));
    }
    return !col.includes(value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    /*
      Check if value is valid in region.
        returns true if value does not exist in region.
        returns false if value already exists in region.
    */
    let position = 9 * (row.toLowerCase().charCodeAt(0) - 97) + (Number(column) - 1);
    let regions = [
      [0, 1, 2, 9, 10, 11, 18, 19, 20], [3, 4, 5, 12, 13, 14, 21, 22, 23], [6, 7, 8, 15, 16, 17, 24, 25, 26],
      [27, 28, 29, 36, 37, 38, 45, 46, 47], [30, 31, 32, 39, 40, 41, 48, 49, 50], [33, 34, 35, 42, 43, 44, 51, 52, 53],
      [54, 55, 56, 63, 64, 65, 72, 73, 74], [57, 58, 59, 66, 67, 68, 75, 76, 77], [60, 61, 62, 69, 70, 71, 78, 79, 80]
    ];
    let isValid = true;
    regions.forEach((region) => {
      if(region.includes(position)){
        region.forEach((cell) => {
          if(puzzleString.charAt(cell) == value) isValid = false;
        });
      }
    });
    return isValid
  }

  solve(puzzleString) {
    /*
      Solves sudoku puzzle:
        returns solution for sudoku puzzle.
    */
    let regions = [
      [0, 1, 2, 9, 10, 11, 18, 19, 20], [3, 4, 5, 12, 13, 14, 21, 22, 23], [6, 7, 8, 15, 16, 17, 24, 25, 26],
      [27, 28, 29, 36, 37, 38, 45, 46, 47], [30, 31, 32, 39, 40, 41, 48, 49, 50], [33, 34, 35, 42, 43, 44, 51, 52, 53],
      [54, 55, 56, 63, 64, 65, 72, 73, 74], [57, 58, 59, 66, 67, 68, 75, 76, 77], [60, 61, 62, 69, 70, 71, 78, 79, 80]
    ];

    let puzzle = puzzleString.split("").map((piece, index) => {
      let row = Math.floor(index / 9);
      let col = index % 9;
      let reg;
      let value = Number(piece) ? Number(piece): piece;
      regions.forEach((region, i) => {
        if(region.includes(index)){
          reg = i;
          return false;
        }
      });
      return {value: value, row: row, column: col, region: reg};
    });

    while(puzzleString.includes(".")){
      puzzle.forEach((puzzlePiece) => {
        let puzzlePieces = [];
        if(puzzlePiece.value === "."){
          for(let i = 1; i <= 9; i++) {
            // Check row.
            let currentRow = puzzle.filter( (placement) => {
              return placement.row == puzzlePiece.row;
            }).map((p) => p.value);
            // Check column.
            let currentColumn = puzzle.filter((placement) => {
              return placement.column == puzzlePiece.column;
            }).map((p) => p.value);
            // Check reqgion.
            let currentRegion = puzzle.filter((placement) => {
              return placement.region == puzzlePiece.region;
            }).map((p) => p.value) ;

            if(!currentRow.includes(i) && !currentColumn.includes(i) && !currentRegion.includes(i)){
              puzzlePieces.push(i);
            }
          }
          if(puzzlePieces.length == 1){
            puzzlePiece.value = puzzlePieces[0];
          }
        }
      });
      // Update puzzle string.
      let newPuzzleString = puzzle.map((puzzlePiece) => {
        return puzzlePiece.value;
      }).join("");

      if(puzzleString === newPuzzleString) break;
      
      puzzleString = newPuzzleString;
    }
    console.log(puzzleString);
    return puzzleString;
  }
}

module.exports = SudokuSolver;

