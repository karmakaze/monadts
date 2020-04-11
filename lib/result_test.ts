#!/usr/bin/env ./node_modules/.bin/ts-node

namespace Result {

class Result<T> {
    _value: T | undefined;
    _error: any;

    public static value<T>(value: T): Result<T> {
        return new Result<T>(value, undefined);
    }

    public static error<T>(error: any): Result<T> {
        return new Result<T>(undefined, error);
    }

    private constructor(value: T|undefined, error: any) {
        this._value = value;
        this._error = error;
    }

    public isEmpty(): boolean {
        return this._value === undefined;
    }

    public value(): T | undefined {
        return this._value;
    }

    public flatMap<U>(f: (x: T) => Result<U>): Result<U> {
        if (this._value) {
            return f(this._value);
        }
        return Result.error(this._error);
    }

    public toString() : string {
        if (this.isEmpty()) {
            return `Result.error(${this._error})`;
        }
        return `Result(${this._value})`;
    }
}

function sqrt(x: number): Result<number> {
    if (x < 0) {
        return Result.error(`can't take root of ${x}`);
    }
    const root_x = Math.sqrt(x);
    if (root_x % 1 === 0) {
        return Result.value(root_x);
    }
    return Result.error(`root of ${x} is not whole`);
}

function test_sqrt(x: number) {
    const y = sqrt(x);
    console.log(`sqrt(${x}) = ${y}`);
}

function test_sqrt2(x: number) {
    const y1 = sqrt(x);
    // const y2 = y1.isEmpty() ? Result.error(undefined) : sqrt(y1.value());
    const y2 = y1.flatMap(sqrt);
    console.log(`sqrt(sqrt(${x})) = ${y2}`);
}

// test_sqrt(2);
// test_sqrt(4);

test_sqrt2(-1);
test_sqrt2(4);
test_sqrt2(16);

}
