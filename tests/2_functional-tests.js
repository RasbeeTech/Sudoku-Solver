const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const puzzlesAndSolutions = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('Solving puzzle: POST /api/solve', () => {
        test('1. Solve a puzzle with valid puzzle string', () => {
            chai.request(server)
                .post('/api/solve')
                .type('form')
                .send({
                    puzzle: puzzlesAndSolutions[0][0]
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'solution', 'Should solve a puzzle with valid string');
                    assert.equal(res.body.solution, puzzlesAndSolutions[0][1], 'Should correctly solve puzzle')
                });
        });
        test('2. Solve a puzzle with missing puzzle string', () => {
            chai.request(server)
                .post('/api/solve')
                .type('form')
                .send({
                    puzzle: null
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error', 'Should respond with an error if puzzle is missing');
                    assert.equal(res.body.error, 'Required field missing', 'Should appropriately respond')
                });
        });
        test('3. Solve a puzzle with invalid characters', () => {
            chai.request(server)
                .post('/api/solve')
                .type('form')
                .send({
                    puzzle: 'A..BC~72.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.XZ...P'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error', 'Should respond with an error if puzzle is missing');
                    assert.equal(res.body.error, 'Invalid characters in puzzle', 'Should appropriately respond')
                });
        });
        test('4. Solve a puzzle with incorrect length', () => {
            chai.request(server)
                .post('/api/solve')
                .type('form')
                .send({
                    puzzle: 'A..BC~72.3...8.5.9.9.25..8.'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error', 'Should respond with an error if puzzle is missing');
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'Should appropriately respond')
                });
        });
        test('5. Solve a puzzle that cannot be solved', () => {
            chai.request(server)
                .post('/api/solve')
                .type('form')
                .send({
                    puzzle: '..839.7.575.....964..1.......16.....6.9.....7..754.....62..5.78.8...3.2...492....'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error', 'Should respond with an error if puzzle is missing');
                    assert.equal(res.body.error, 'Puzzle cannot be solved', 'Should appropriately respond')
                });
        });
    });
    suite('Checking puzzle: POST /api/check', () => {
        test('6. Check a puzzle placement with all fields', () => {
            chai.request(server)
                .post('/api/check')
                .type('form')
                .send({
                    puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                    coordinate: 'B7',
                    value: 3
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid', 'Should have a valid property');
                    assert.isTrue(res.body.valid, 'Should appropriately to respond valid input');
                });
        });
        test('7. Check a puzzle placement with single placement conflict', () => {
            chai.request(server)
                .post('/api/check')
                .type('form')
                .send({
                    puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                    coordinate: 'A1',
                    value: 6
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid', 'Should have a valid property');
                    assert.property(res.body, 'conflict', 'Should report conflict when checking');
                    assert.isFalse(res.body.valid, 'Should respond to invalid puzzle piece positioning');
                    assert.isArray(res.body.conflict, 'The conflict property should be an Array');
                    assert.equal(res.body.conflict.length, 1, 'Should only have one conflict')
                });
        });
        test('8. Check a puzzle placement with multiple placement conflicts', () => {
            chai.request(server)
                .post('/api/check')
                .type('form')
                .send({
                    puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                    coordinate: 'E5',
                    value: 9
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid', 'Should have a valid property');
                    assert.property(res.body, 'conflict', 'Should report conflict when checking');
                    assert.isFalse(res.body.valid, 'Should respond to invalid puzzle piece positioning');
                    assert.isArray(res.body.conflict, 'The conflict property should be an Array');
                    assert.equal(res.body.conflict.length, 2, 'Should only have three conflicts')
                });
        });
        test('9. Check a puzzle placement with all placement conflicts', () => {
            chai.request(server)
                .post('/api/check')
                .type('form')
                .send({
                    puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                    coordinate: 'I9',
                    value: 3
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid', 'Should have a valid property');
                    assert.property(res.body, 'conflict', 'Should report conflict when checking');
                    assert.isFalse(res.body.valid, 'Should respond to invalid puzzle piece positioning');
                    assert.isArray(res.body.conflict, 'The conflict property should be an Array');
                    assert.equal(res.body.conflict.length, 3, 'Should only have three conflicts')
                });
        });
        test('10. Check a puzzle placement with missing required fields', () => {
            chai.request(server)
                .post('/api/check')
                .type('form')
                .send({
                    coordinate: 'I9',
                    value: 3
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error', 'Should respond with an error if puzzle is missing');
                    assert.equal(res.body.error, 'Required field missing', 'Should alert describe reason for error')
                });
        });
        test('11. Check a puzzle placement with invalid characters', () => {
            chai.request(server)
                .post('/api/check')
                .type('form')
                .send({
                    puzzle: '..I..N.V.AL.ID...CHAR......A...CT.ER.S.....1.62.71...9......1945....4.37.4.3..6..',
                    coordinate: 'I9',
                    value: 3
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error', 'Should respond with an error if puzzle is missing');
                    assert.equal(res.body.error, 'Invalid characters in puzzle', 'Should alert describe reason for error')
                });
        });
        test('12. Check a puzzle placement with incorrect length', () => {
            chai.request(server)
                .post('/api/check')
                .type('form')
                .send({
                    puzzle: '..9..5.1.85.4....2432......1',
                    coordinate: 'I9',
                    value: 3
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error', 'Should respond with an error if puzzle is missing');
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'Should alert describe reason for error')
                });
        });
        test('13. Check a puzzle placement with invalid placement coordinate', () => {
            chai.request(server)
                .post('/api/check')
                .type('form')
                .send({
                    puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                    coordinate: 'J9',
                    value: 3
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error', 'Should respond with an error if puzzle is missing');
                    assert.equal(res.body.error, 'Invalid coordinate', 'Should alert describe reason for error')
                });
        });
        test('14. Check a puzzle placement with invalid placement value', () => {
            chai.request(server)
                .post('/api/check')
                .type('form')
                .send({
                    puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                    coordinate: 'A9',
                    value: 10
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error', 'Should respond with an error if puzzle is missing');
                    assert.equal(res.body.error, 'Invalid value', 'Should alert describe reason for error')
                });
        });
    });
});

