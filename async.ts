#!/usr/bin/env ./node_modules/.bin/ts-node

async function square(x: number): Promise<number> {
  return x * x;
}

async function test_square(x: number) {
  const y = await square(x);
  console.log(`square(${x}) = ${y}`);
}

async function test_square2(x: number) {
  const x2 = await square(x);
  const x4 = await square(x2);
  console.log(`square(square(${x})) = ${x4}`);
}

test_square(2);
test_square2(2);


class Async<T> {
    future_t: Promise<T>

    constructor(future_t: Promise<T>) {
        this.future_t = future_t;
    }

    public flatMap<U>(f: (t: T) => Async<U>): Async<U> {
        const pau: Promise<Async<U>> = this.future_t.then(f);
        const executor = (resolve, reject) => pau.then(au => au.future_t.then(resolve).catch(reject));
        return new Async<U>(new Promise<U>(executor));
    }

    public toString(): string {
        return `Async(${this.future_t})`;
    }
}

function asquare(x: number): Async<number> {
    return new Async<number>(new Promise((resolve) => resolve(x * x)));
}

function test_asquare(t: number) {
    const async_u = asquare(t);
    console.log(`-> ${async_u}`);
    async_u.flatMap(u => {
        console.log(`asquare(${t}) = ${u}`);
        return new Async<number>(new Promise<number>((resolve) => resolve(u)));
    });
}

test_asquare(2);
