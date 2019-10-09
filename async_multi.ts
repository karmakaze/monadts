#!/usr/bin/env ./node_modules/.bin/ts-node

class Async<T> {
    future_t: Promise<T>

    public static of<T>(t: T): Async<T> {
        return new Async<T>(new Promise(resolve => resolve(t)));
    }

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

class Multi<T> {
    ts: T[];

    public constructor(...ts: T[]) {
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
            return new Multi<U>();
        }
        const us: U[] = [];
                            // ys += f(x).values()
                            // ys.push(values[0], values[1], ... , values[m])
        this.ts.forEach((t) => Array.prototype.push.apply(us, f(t).values()));
        return new Multi<U>(...us);
    }

    public toString() : string {
        return `Multi(${this.ts})`;
    }
}

function sqrt(x: number): Multi<number> {
    if (x < 0) {
        return new Multi<number>();
    }
    if (x === 0) {
        return new Multi<number>(0);
    }
    const root_x = Math.sqrt(x);
    return new Multi<number>(-root_x, root_x);
}

function test_async_multi(xs: Async<number>, ys: Multi<number>) {
    const zs: Async<Multi<number>> = xs.flatMap(x => {
        const zs = ys.flatMap(y => {
            console.log(`inner(${x} * ${y} = ${x * y})`);
            return new Multi<number>(x * y);
        });
        console.log(`middle(${zs})`);
        return Async.of(zs);
    });
    console.log(`async_multi(${zs})`);
    zs.flatMap(z => {
        console.log(`z = ${z}`);
        return Async.of(new Multi());
    });
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

test_async_multi(Async.of(3), new Multi<number>(2, 4, 6));
