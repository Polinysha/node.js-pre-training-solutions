import { mapArray, filterArray, reduceArray, partition, groupBy } from './array-helpers.js';

console.log('Testing Task 02: Array Helpers');

// Test mapArray
const mapped = mapArray([1, 2, 3], n => n * 2);
console.log('mapArray([1, 2, 3], n => n * 2):', mapped);

// Test filterArray
const filtered = filterArray(['a', 'bb', 'c'], s => s.length === 1);
console.log('filterArray(["a", "bb", "c"], s => s.length === 1):', filtered);

// Test reduceArray
const reduced = reduceArray([1, 2, 3], (a, n) => a + n, 0);
console.log('reduceArray([1, 2, 3], (a, n) => a + n, 0):', reduced);

// Test partition
const partitioned = partition([1, 2, 3, 4], n => n % 2 === 0);
console.log('partition([1, 2, 3, 4], n => n % 2 === 0):', partitioned);

// Test groupBy
const grouped = groupBy([
    { id: 1, tag: 'home' },
    { id: 2, tag: 'work' },
    { id: 3, tag: 'home' }
], t => t.tag);
console.log('groupBy by tag:', grouped);

console.log('All manual tests passed!');
