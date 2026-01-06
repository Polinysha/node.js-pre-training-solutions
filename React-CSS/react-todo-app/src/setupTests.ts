import '@testing-library/jest-dom';

const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: `ReactDOMTestUtils.act` is deprecated')
    ) {
      return;
    }
    if (
      typeof args[0] === 'string' &&
      args[0].includes('React Router Future Flag Warning')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
}); 
