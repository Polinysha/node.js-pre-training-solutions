// solutions/array-helpers.ts
export function mapArray<T, R>(source: readonly T[], mapper: (item: T, index: number) => R): R[] {
    if (source == null) throw new TypeError('Source is null or undefined');

    const result: R[] = [];
    for (let i = 0; i < source.length; i++) {
        result.push(mapper(source[i], i));
    }
    return result;
}

export function filterArray<T>(source: readonly T[], predicate: (item: T, index: number) => boolean): T[] {
    if (source == null) throw new TypeError('Source is null or undefined');

    const result: T[] = [];
    for (let i = 0; i < source.length; i++) {
        if (predicate(source[i], i)) {
            result.push(source[i]);
        }
    }
    return result;
}

export function reduceArray<T, R>(source: readonly T[], reducer: (acc: R, item: T, index: number) => R, initial: R): R {
    if (source == null) throw new TypeError('Source is null or undefined');

    let acc = initial;
    for (let i = 0; i < source.length; i++) {
        acc = reducer(acc, source[i], i);
    }
    return acc;
}

export function partition<T>(source: readonly T[], predicate: (item: T) => boolean): [T[], T[]] {
    if (source == null) throw new TypeError('Source is null or undefined');

    const pass: T[] = [];
    const fail: T[] = [];

    for (const item of source) {
        if (predicate(item)) {
            pass.push(item);
        } else {
            fail.push(item);
        }
    }
    return [pass, fail];
}

export function groupBy<T, K extends PropertyKey>(source: readonly T[], keySelector: (item: T) => K): Record<K, T[]> {
    if (source == null) throw new TypeError('Source is null or undefined');

    const result = {} as Record<K, T[]>;

    for (const item of source) {
        const key = keySelector(item);
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(item);
    }
    return result;
}
