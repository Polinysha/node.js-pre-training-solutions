"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapArray = mapArray;
exports.filterArray = filterArray;
exports.reduceArray = reduceArray;
exports.partition = partition;
exports.groupBy = groupBy;
function mapArray(source, mapper) {
    if (source == null)
        throw new TypeError('Source is null or undefined');
    const result = [];
    for (let i = 0; i < source.length; i++) {
        result.push(mapper(source[i], i));
    }
    return result;
}
function filterArray(source, predicate) {
    if (source == null)
        throw new TypeError('Source is null or undefined');
    const result = [];
    for (let i = 0; i < source.length; i++) {
        if (predicate(source[i], i)) {
            result.push(source[i]);
        }
    }
    return result;
}
function reduceArray(source, reducer, initial) {
    if (source == null)
        throw new TypeError('Source is null or undefined');
    let acc = initial;
    for (let i = 0; i < source.length; i++) {
        acc = reducer(acc, source[i], i);
    }
    return acc;
}
function partition(source, predicate) {
    if (source == null)
        throw new TypeError('Source is null or undefined');
    const pass = [];
    const fail = [];
    for (const item of source) {
        if (predicate(item)) {
            pass.push(item);
        }
        else {
            fail.push(item);
        }
    }
    return [pass, fail];
}
function groupBy(source, keySelector) {
    if (source == null)
        throw new TypeError('Source is null or undefined');
    const result = {};
    for (const item of source) {
        const key = keySelector(item);
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(item);
    }
    return result;
}
