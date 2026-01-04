const Calculator = require('./calculator.js');

describe('Calculator', () => {
  let calc;

  beforeEach(() => {
    calc = new Calculator();
  });

  describe('Basic operations', () => {
    test('should add two numbers', () => {
      expect(calc.add(5, 3)).toBe(8);
      expect(calc.getLastResult()).toBe(8);
    });

    test('should subtract two numbers', () => {
      expect(calc.subtract(10, 4)).toBe(6);
      expect(calc.getLastResult()).toBe(6);
    });

    test('should multiply two numbers', () => {
      expect(calc.multiply(7, 6)).toBe(42);
      expect(calc.getLastResult()).toBe(42);
    });

    test('should divide two numbers', () => {
      expect(calc.divide(20, 4)).toBe(5);
      expect(calc.getLastResult()).toBe(5);
    });

    test('should throw error when dividing by zero', () => {
      expect(() => calc.divide(10, 0)).toThrow('Division by zero');
    });

    test('should throw error for non-number division', () => {
      expect(() => calc.divide('10', 2)).toThrow('Both arguments must be numbers');
    });
  });

  describe('Scientific functions with input validation', () => {
    test('should calculate power', () => {
      expect(calc.power(2, 3)).toBe(8);
      expect(calc.getLastResult()).toBe(8);
    });

    test('should throw error for non-number power arguments', () => {
      expect(() => calc.power('2', 3)).toThrow('Both arguments must be numbers');
      expect(() => calc.power(2, '3')).toThrow('Both arguments must be numbers');
    });

    test('should calculate square root', () => {
      expect(calc.squareRoot(16)).toBe(4);
      expect(calc.getLastResult()).toBe(4);
    });

    test('should throw error for negative square root', () => {
      expect(() => calc.squareRoot(-4)).toThrow('Cannot calculate square root of negative number');
    });

    test('should throw error for non-number square root', () => {
      expect(() => calc.squareRoot('16')).toThrow('Argument must be a number');
    });

    test('should calculate factorial', () => {
      expect(calc.factorial(5)).toBe(120);
      expect(calc.getLastResult()).toBe(120);
    });

    test('should calculate factorial of 0 and 1', () => {
      expect(calc.factorial(0)).toBe(1);
      expect(calc.factorial(1)).toBe(1);
    });

    test('should throw error for negative factorial', () => {
      expect(() => calc.factorial(-5)).toThrow('Factorial not defined for negative numbers');
    });

    test('should throw error for non-number factorial', () => {
      expect(() => calc.factorial('5')).toThrow('Argument must be a number');
    });
  });

  describe('Memory functions', () => {
    test('should reset last result', () => {
      calc.add(5, 3);
      calc.reset();
      expect(calc.getLastResult()).toBe(0);
    });
  });
});
