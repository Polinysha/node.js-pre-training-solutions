// Calculator module for Git workflow demonstration
class Calculator {
  constructor() {
    this.lastResult = 0;
  }

  add(a, b) {
    this.lastResult = a + b;
    return this.lastResult;
  }

  subtract(a, b) {
    this.lastResult = a - b;
    return this.lastResult;
  }

  multiply(a, b) {
    this.lastResult = a * b;
    return this.lastResult;
  }

  divide(a, b) {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    this.lastResult = a / b;
    return this.lastResult;
  }

  // New scientific functions
  power(base, exponent) {
    if (typeof base !== "number" || typeof exponent !== "number") {
      throw new Error("Both arguments must be numbers");
    }
    this.lastResult = Math.pow(base, exponent);
    return this.lastResult;
  }

  squareRoot(number) {
    if (typeof number !== "number") {
      throw new Error("Argument must be a number");
    }
    if (number < 0) {
      throw new Error('Cannot calculate square root of negative number');
    }
    this.lastResult = Math.sqrt(number);
    return this.lastResult;
  }

  factorial(n) {
    if (typeof n !== "number") {
      throw new Error("Argument must be a number");
    }
    if (n < 0) {
      throw new Error('Factorial not defined for negative numbers');
    }
    if (n === 0 || n === 1) {
      this.lastResult = 1;
      return this.lastResult;
    }
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    this.lastResult = result;
    return this.lastResult;
  }

  getLastResult() {
    return this.lastResult;
  }

  reset() {
    this.lastResult = 0;
  }
}

module.exports = Calculator;

