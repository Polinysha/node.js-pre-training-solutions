# Simple Calculator Project

A demonstration project for Git workflow practice.

## Features
- Basic arithmetic operations
- Unit tests
- Documentation

## Installation
\\\ash
npm install
\\\

## Usage
\\\javascript
const calculator = require('./calculator');
console.log(calculator.add(2, 3)); // 5
\\\
"@ | Out-File -FilePath "README.md" -Encoding UTF8

# Создаем простой файл calculator.js
@"
// calculator.js - Simple calculator module

module.exports = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => b !== 0 ? a / b : 'Error: Division by zero',
    power: (a, b) => Math.pow(a, b),
    squareRoot: (a) => a >= 0 ? Math.sqrt(a) : 'Error: Negative number'
};
