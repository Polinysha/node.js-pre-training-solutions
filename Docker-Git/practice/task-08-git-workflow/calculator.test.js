// calculator.test.js - Unit tests for calculator
const calculator = require('./calculator');

console.log('Running calculator tests...');

// Test addition
console.assert(calculator.add(2, 3) === 5, 'Addition test failed');
console.assert(calculator.add(-1, 1) === 0, 'Negative addition test failed');

// Test subtraction
console.assert(calculator.subtract(5, 3) === 2, 'Subtraction test failed');

// Test multiplication
console.assert(calculator.multiply(4, 5) === 20, 'Multiplication test failed');

// Test division
console.assert(calculator.divide(10, 2) === 5, 'Division test failed');
console.assert(calculator.divide(5, 0) === 'Error: Division by zero', 'Division by zero test failed');

// Test power
console.assert(calculator.power(2, 3) === 8, 'Power test failed');

// Test square root
console.assert(calculator.squareRoot(9) === 3, 'Square root test failed');
console.assert(calculator.squareRoot(-1) === 'Error: Negative number', 'Negative square root test failed');

console.log('All tests passed!');
