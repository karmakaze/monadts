#!/usr/bin/env ./node_modules/.bin/ts-node

function a_to_s(a: any[]): string {
    return '[' + a.map(v => {
        if (v instanceof Array) {
            return a_to_s(v);
        } else {
            return `${v}`;
        }
    }).join(', ') + ']';
}

function test_map(xs: number[], f: (n: number) => any) {
    const ys = xs.map(f);
    console.log(`${a_to_s(xs)}.map(f) = ${a_to_s(ys)}`);
}

function test_flat_map(xs: number[], f: (n: number) => any) {
    const ys = xs.flatMap(f);
    console.log(`${a_to_s(xs)}.flatMap(f) = ${a_to_s(ys)}`);
}

test_map([1, 2, 3, 4], (x) => [-x, [x]]);
test_flat_map([1, 2, 3, 4], (x) => [-x, [x]]);
