#!/usr/bin/env ./node_modules/.bin/ts-node

namespace Processed {

interface Processed<P extends Processed<P, unknown>, T> {
    flatMap<U>(f: (x: T) => Processed<P, U>): Processed<P, U>;
}

class Maybe<T> implements Processed<Maybe<unknown>, T> {
    x: T | undefined;

    public static of<T>(x: T) {
        return new Maybe(x);
    }

    public static nothing<T>() {
        return new Maybe(undefined);
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
        return Maybe.nothing();
    }

    public toString() : string {
        return `Maybe(${this.x})`;
    }
}

function positive_sqrt(x: number): Maybe<number> {
    if (x < 0) {
        return Maybe.nothing();
    }
    const root_x = Math.sqrt(x);
    if (root_x % 1 === 0) {
        return Maybe.of(root_x);
    }
    return Maybe.nothing();
}

function test_positive_sqrt(x: number) {
    const y = positive_sqrt(x);
    console.log(`positive_sqrt(${x}) = ${y}`);
}

function test_positive_sqrt2(x: number) {
    const y1 = positive_sqrt(x);
    const y2 = y1.isEmpty() ? Maybe.nothing() : positive_sqrt(y1.unwrap());
    // const y2 = y1.flatMap(positive_sqrt);
    console.log(`positive_sqrt(positive_sqrt(${x})) = ${y2}`);
}

console.log("======== Maybe test ========");

test_positive_sqrt(2);
test_positive_sqrt(4);
test_positive_sqrt2(4);
test_positive_sqrt2(16);

console.log();

class Result<T> implements Processed<Result<unknown>, T> {
    _value: T|undefined;
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

    public value(): T|undefined {
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
        return `Result.value(${this._value})`;
    }
}

function result_sqrt(x: number): Result<number> {
    if (x < 0) {
        return Result.error(`can't take root of ${x}`);
    }
    const root_x = Math.sqrt(x);
    if (root_x % 1 === 0) {
        return Result.value(root_x);
    }
    return Result.error(`root of ${x} is not whole`);
}

function test_result_sqrt(x: number) {
    const y = result_sqrt(x);
    console.log(`result_sqrt(${x}) = ${y}`);
}

function test_result_sqrt2(x: number) {
    const y1 = result_sqrt(x);
    // const y2 = y1.isEmpty() ? Result.error(undefined) : result_sqrt(y1.value());
    const y2 = y1.flatMap(result_sqrt);
    console.log(`result_sqrt(result_sqrt(${x})) = ${y2}`);
}

console.log("======== Result test ========");

test_result_sqrt(2);
test_result_sqrt(4);
test_result_sqrt2(-1);
test_result_sqrt2(4);
test_result_sqrt2(16);

console.log();


class Multi<T> implements Processed<Multi<unknown>, T> {
    ts: T[];

    public static of<V>(...vs: V[]): Multi<V> {
        return new Multi<V>(...vs);
    }

    private constructor(...ts: T[]) {
        this.ts = ts;
    }

    public isEmpty(): boolean {
        return this.ts.length === 0;
    }

    public values(): T[] {
        return this.ts;
    }

    public flatMap<U>(f: (t: T) => Multi<U>): Multi<U> {
        if (this.isEmpty()) {
            return Multi.of();
        }
        const us: U[] = [];
                            // ys += f(x).values()
                            // ys.push(values[0], values[1], ... , values[m])
        this.ts.forEach((t) => {
            const ft = f(t);
            console.log(`-> f(${t}) = ${ft}`);
            return Array.prototype.push.apply(us, (ft).values());
        });
        return Multi.of(...us);
    }

    public toString() : string {
        return `Multi(${this.ts})`;
    }
}

function integer_sqrt(x: number): Multi<number> {
    if (x < 0) {
        return Multi.of();
    }
    if (x === 0) {
        return Multi.of(0);
    }
    const root_x = Math.sqrt(x);
    return Multi.of(-root_x, root_x);
}

function test_integer_sqrt(x: number) {
    const y = integer_sqrt(x);
    console.log(`integer_sqrt(${x}) = ${y}`);
}

function test_integer_sqrt2(x: number) {
    const y1 = integer_sqrt(x);
    const y2 = y1.flatMap(integer_sqrt);
    console.log(`integer_sqrt(integer_sqrt(${x})) = ${y2}`);
}

function test_multi_integer_sqrt(xs: Multi<number>) {
    const ys = xs.flatMap(integer_sqrt);
    console.log(`multi_integer_sqrt(${xs})) = ${ys}`);
}

function test_multi_product(xs: Multi<number>, ys: Multi<number>) {
    const zs = xs.flatMap(x => {
        return ys.flatMap(y => Multi.of(x * y));
    });
    console.log(`multi_product(${xs}, ${ys})) = ${zs}`);
}

console.log("======== Multi test ========");
test_integer_sqrt(0);
test_integer_sqrt(2);
test_integer_sqrt(4);
test_integer_sqrt2(4);
test_integer_sqrt2(16);
test_multi_integer_sqrt(Multi.of(0, 1, 4));
test_multi_product(Multi.of(1, 2, 3), Multi.of(5, 7));
console.log();


class Async<T> implements Processed<Async<unknown>, T> {
    future_t: Promise<T>

    public static ofPromise<U>(pu: Promise<U>): Async<U> {
        return new Async<U>(pu);
    }
    public static ofValue<U>(u: U): Async<U> {
        return Async.ofPromise(new Promise<U>((resolve) => resolve(u)));
    }

    constructor(future_t: Promise<T>) {
        this.future_t = future_t;
    }

    public flatMap<U>(f: (t: T) => Async<U>): Async<U> {
        const pau: Promise<Async<U>> = this.future_t.then(f);
        const completer = (resolve, reject) => pau.then(au => au.future_t.then(resolve).catch(reject));
        return Async.ofPromise(new Promise<U>(completer));
    }

    public toString(): string {
        return `Async(${this.future_t})`;
    }
}

function async_square(x: number): Async<number> {
    return Async.ofValue(x * x);
}

function test_async_square(t: number) {
    const async_u = async_square(t);
    console.log(`${async_u}`);
    async_u.flatMap(u => {
        console.log(`async_square(${t}) = ${u}`);
        return Async.ofValue(u);
    });
}

console.log("======== Compose test ========");

function compose<T, U, V, PU extends Processed<PU, U>,
                          PV extends Processed<PV, V>,
                          PPV extends Processed<PPV, PV>>
                (f: (t: T) => PU, g: (u: U) => PV, make: (pv: PV) => PPV): (t: T) => PPV {
    return (t: T) => {
        const pu: PU = f(t);
        console.log(`-> f(${t}) = ${pu}`);
        const gfx = pu.flatMap((u: U) => {
            const pv: PV = g(u);
            return <PU><unknown>make(pv);
        });
        console.log(`-> f(${t}).flatMap(g) = ${gfx}`);
        return <PPV><unknown>gfx;
    };
}

const fg = compose(positive_sqrt, integer_sqrt, Maybe.of);
const maybe_multi_number: Maybe<Multi<number>> = fg(81);
console.log(`compose(positive_sqrt, integer_sqrt)(81) = ${maybe_multi_number}`);

const gf = compose(integer_sqrt, positive_sqrt, Multi.of);
const multi_maybe_number = gf(81);
console.log(`compose(integer_sqrt, positive_sqrt)(81) = ${multi_maybe_number}`);

console.log();


console.log("======== Async test ========");
test_async_square(2);
console.log();


function test_positive_sqrt_integer_sqrt_async_square(n: number) {
    const maybe_number: Maybe<number> = positive_sqrt(n);
    const maybe_multi_number: Maybe<Multi<number>> = maybe_number.flatMap(x => Maybe.of(integer_sqrt(x)));

    const maybe_multi_async_number: Maybe<Multi<Async<number>>> = maybe_multi_number.flatMap(multi_number => {
        return Maybe.of(multi_number.flatMap(x => Multi.of(async_square(x))));
    });

    maybe_multi_async_number.flatMap(ma => {
        ma.flatMap(a => {
            a.flatMap(y => {
                console.log(`positive_sqrt_async_square_multi_sqrt(${n}) = ${y}`);
                console.log(`maybe_multi_async_number ${maybe_multi_async_number}`);
                return Async.ofValue(0);
            });
            return Multi.of(0);
        });
        return Maybe.of(0);
    });

    console.log(`test_positive_sqrt_integer_sqrt_async_square(${n}) = ${maybe_multi_async_number}`);
}

console.log("======== Maybe Multi Async test ========");
// 16 | positive_sqrt | integer_sqrt | async_square
test_positive_sqrt_integer_sqrt_async_square(16);
console.log("======== the end ========");

}
