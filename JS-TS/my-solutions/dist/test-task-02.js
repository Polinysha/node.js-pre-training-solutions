"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const array_helpers_js_1 = require("./array-helpers.js");
console.log('Testing Task 02: Array Helpers');
// Test mapArray
const mapped = (0, array_helpers_js_1.mapArray)([1, 2, 3], n => n * 2);
console.log('mapArray([1, 2, 3], n => n * 2):', mapped);
// Test filterArray
const filtered = (0, array_helpers_js_1.filterArray)(['a', 'bb', 'c'], s => s.length === 1);
console.log('filterArray(["a", "bb", "c"], s => s.length === 1):', filtered);
// Test reduceArray
const reduced = (0, array_helpers_js_1.reduceArray)([1, 2, 3], (a, n) => a + n, 0);
console.log('reduceArray([1, 2, 3], (a, n) => a + n, 0):', reduced);
// Test partition
const partitioned = (0, array_helpers_js_1.partition)([1, 2, 3, 4], n => n % 2 === 0);
console.log('partition([1, 2, 3, 4], n => n % 2 === 0):', partitioned);
// Test groupBy
const grouped = (0, array_helpers_js_1.groupBy)([
    { id: 1, tag: 'home' },
    { id: 2, tag: 'work' },
    { id: 3, tag: 'home' }
], t => t.tag);
console.log('groupBy by tag:', grouped);
console.log('All manual tests passed!');
