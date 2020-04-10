#!/usr/bin/env ./node_modules/.bin/ts-node

namespace Maybe {

class Maybe<T> {
    x: T | undefined;

    public static of<U>(u: U): Maybe<U> {
        return new Maybe<U>(u);
    }

    public static nothing<U>(): Maybe<U> {
        return new Maybe<U>(undefined);
    }

    private constructor(x: T|undefined) {
        this.x = x;
    }

    public isEmpty(): boolean {
        return this.x === undefined;
    }

    public unwrap(): T {
        return this.x;
    }

    public flatMap<U>(f: (x: T) => Maybe<U>): Maybe<U> {
        if (this.x) {
            return f(this.x);
        }
        return new Maybe<U>(undefined);
    }

    public toString() : string {
        if (this.x === undefined) {
            return `Maybe.nothing()`;
        }
        return `Maybe(${this.x})`;
    }
}

function sqrt(x: number): Maybe<number> {
    if (x < 0) {
        return Maybe.nothing();
    }
    const root_x = Math.sqrt(x);
    if (root_x % 1 === 0) {
        return Maybe.of(root_x);
    }
    return Maybe.nothing();
}

function test_sqrt(x: number) {
    const y = sqrt(x);
    console.log(`sqrt(${x}) = ${y}`);
}

function test_sqrt2(x: number) {
    const y1 = sqrt(x);
    // const y2 = y1.isEmpty() ? Maybe.nothing() : sqrt(y1.unwrap());
    const y2 = y1.flatMap(sqrt);
    console.log(`sqrt(sqrt(${x})) = ${y2}`);
}

// test_sqrt(2);
// test_sqrt(4);
test_sqrt2(2);
test_sqrt2(4);
test_sqrt2(16);

}
