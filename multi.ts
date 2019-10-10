#!/usr/bin/env ./node_modules/.bin/ts-node

namespace Multi {

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

function test_sqrt(x: number) {
    const y = sqrt(x);
    console.log(`sqrt(${x}) = ${y}`);
}

function test_sqrt2(x: number) {
    const y1 = sqrt(x);
    const y2 = y1.flatMap(sqrt);
    console.log(`sqrt(sqrt(${x})) = ${y2}`);
}

function test_multi_sqrt(xs: Multi<number>) {
    const ys = xs.flatMap(sqrt);
    console.log(`multi_sqrt(${xs})) = ${ys}`);
}

function test_multi_product(xs: Multi<number>, ys: Multi<number>) {
    const zs = xs.flatMap(x => {
        return ys.flatMap(y => new Multi<number>(x * y));
    });
    console.log(`multi_product(${xs}, ${ys})) = ${zs}`);
}

test_sqrt(0);
test_sqrt(2);
test_sqrt(4);
test_sqrt2(4);
test_sqrt2(16);
test_multi_sqrt(new Multi<number>(0, 1, 4));
test_multi_product(new Multi<number>(1, 2, 3), new Multi<number>(5, 7));

}
