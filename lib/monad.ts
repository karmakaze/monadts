interface Monad<M extends Monad<M, any>, T> {
    then<R>(f: (t: T) => Monad<M, R>): Monad<M, R>;

    zero<V>(): Monad<M, V>;
    unit<V>(v: V): Monad<M, V>;
}
