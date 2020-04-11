abstract class Result<T, E> implements Monad<Result<any, any>, T> {
    public static value<V, E>(value: V): Result<V, E> {
        // placeholder body replaced at bottom after Value declaration
        return null;
    }

    public static error<V, E>(error: E): Result<V, E> {
        // placeholder body replaced at bottom after Error declaration
        return null;
    }

    abstract then<R>(f: (t: T) => Monad<Result<any, E>, R>): Result<R, E>;

    public zero<V>(): Result<V, E> {
        return Maybe.NONE;
    }

    public unit<V, E>(v: V): Result<V, E> {
        if (v === null || v === undefined) {
            return Maybe.NONE;
        }
        return Maybe.some(v);
    }

    public static cast<V, E>(mv: Monad<Result<any, E>, V>): Result<V, E> {
        return mv as Result<V, E>;
    }
}

class ResultError<E> extends Result<any, E> {
    private error: E;

    constructor(error: E) {
        super();
        this.error = error;
    }

    public then<R>(f: (v: any) => Monad<Result<any, E>, R>): Result<R, E> {
        return Result.cast<R, E>(this);
    }
}
Result.error = <E>(error: E) => new ResultError<E>(error);

class ResultValue<V> extends Result<V, any> {
    private value: V;

    constructor(value: V) {
        super();
        this.value = value;
    }

    public then<R, E>(f: (v: V) => Monad<Result<any, E>, R>): Result<R, E> {
        return Result.cast<R, E>(f(this.value));
    }
}
Result.value = <V, E>(v: V) => (v === null || v === undefined ? new ResultError<E>(null) : new ResultValue<V>(v));
