'use strict';

const { response } = require('express');
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let { puzzle } = req.body;
      let { coordinate } = req.body;
      let { value } = req.body;
      coordinate = coordinate.split("");

      // Check for valid puzzle.
      if(!puzzle) return res.json({error: 'Required field missing'});
      if(puzzle.length != 81) return res.json({ error: 'Expected puzzle to be 81 characters long' });
      if(solver.validate(puzzle)) return res.json({error: 'Invalid characters in puzzle'});

      if( !/[a-iA-I]/.test(coordinate[0])|| !/^[1-9]*$/.test(coordinate[1]) || coordinate.length > 2){
        return res.json({error: 'Invalid coordinate'});
      }
      if (Number(value) > 9 || Number(value) < 1){
        return res.json({error: 'Invalid value'});
      }

      if(value == puzzle[Number(9 * (coordinate[0].toLowerCase().charCodeAt(0) - 97) + (coordinate[1] - 1))]){
        return res.json({ valid: true });
      }

      let isValidInRow = solver.checkRowPlacement(puzzle, coordinate[0], coordinate[1], value);
      let isValidInCol = solver.checkColPlacement(puzzle, coordinate[0], coordinate[1], value);
      let isValidInRegion = solver.checkRegionPlacement(puzzle, coordinate[0], coordinate[1], value);

      // Response:
      let response = {
        valid: isValidInRow && isValidInCol && isValidInRegion
      };

      if(!response.valid){
        response.conflict = [];
        if(!isValidInRow) response.conflict.push('row');
        if(!isValidInCol) response.conflict.push('column');
        if(!isValidInRegion) response.conflict.push('region');
      }
      res.json(response);
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let { puzzle } = req.body;
      
      // Check for valid puzzle.
      if(!puzzle) return res.json({error: 'Required field missing'});
      if(puzzle.length != 81) return res.json({ error: 'Expected puzzle to be 81 characters long' });
      if(solver.validate(puzzle)) return res.json({error: 'Invalid characters in puzzle'});
      
      // Attempt to solve puzzle.
      let solved = solver.solve(puzzle);

      // Response.
      if(!solved.includes(".")){
        res.json({
          solution: solved
        });
      } else {
        res.json({
          error: 'Puzzle cannot be solved'
        });
      }
    });
};
