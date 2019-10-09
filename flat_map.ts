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

function test_map(xs: number[]) {
    const ys = xs.map(x => [-x, x]);
    console.log(`${a_to_s(xs)}.map(f) = ${a_to_s(ys)}`);
}

function test_flat_map(xs: number[]) {
    const ys = xs.flatMap(x => [x, -x]);
    console.log(`${a_to_s(xs)}.flatMap(f) = ${a_to_s(ys)}`);
}

test_map([1, 2, 3, 4]);
test_flat_map([1, 2, 3, 4]);
