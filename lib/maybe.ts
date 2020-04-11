
abstract class Maybe<T> implements Monad<Maybe<any>, T> {
    static None = class extends Maybe<any> {    
        public then<R>(f: (_: any) => Monad<Maybe<any>, R>): Maybe<R> {
            return Maybe.NONE;
        }
    }
    public static NONE = new Maybe.None();

    public static some<V>(v: V): Maybe<V> {
        // placeholder body replaced at bottom after Some declaration
        return null;
    }

    abstract then<R>(f: (t: T) => Monad<Maybe<any>, R>): Maybe<R>;

    public zero<V>(): Maybe<V> {
        return Maybe.NONE;
    }

    public unit<V>(v: V): Maybe<V> {
        if (v === null || v === undefined) {
            return Maybe.NONE;
        }
        return Maybe.some(v);
    }

    public static cast<V>(mv: Monad<Maybe<any>, V>): Maybe<V> {
        return mv as Maybe<V>;
    }
}

class Some<T> extends Maybe<T> {
    private t: T;

    constructor(t: T) {
        super();
        this.t = t;
    }

    public then<R>(f: (t: T) => Monad<Maybe<any>, R>): Maybe<R> {
        return Maybe.cast(f(this.t));
    }
}
Maybe.some = <V>(v: V) => (v === null || v === undefined ? Maybe.NONE : new Some<V>(v));
