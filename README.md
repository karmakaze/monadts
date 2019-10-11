# monadts
Fun with flatMap

### flatMap

An array can be 'mapped' using a function to produce an array of values from function application.

The output array has the same shape as the input array except that the element type may be different (e.g. by applying a function that takes an integer and outputs a string).

Let's say we have a function that takes an integer and returns a list of (zero, one, or more) integers depending on the input value.
If we apply this function to an array of integers, we end up with an array of arrays. Each entry in the output array is an array resulting from applying the function on the corresponding element of the input array.

```
[0, 4, 9].map(integer_square_root)
=> [[0], [-2, 2], [-3, 3]]
```
Notice how the shape of the output is different from the input.

FlatMap is like map but it flattens the output.
```
[0, 4, 9].flatMap(integer_square_root)
=> [0, -2, 2, -3, 3]
```

Notice now how the shape of the output is the same as the input. This combination of applying:
- a function that takes a thing and outputs a shape (e.g. array) of thing,
- on an input of shape of thing,
outputting the same shape of thing is a magical property of flatMap.

One big benefit is that it allows chaining operations because the input and output shapes are the same we can keep applying more functions and still be dealing with only one shape.

Not only that but we can use flatMap to process things that are not shapes in the normal sense in a uniform way.

Finally using a programming language with compile-time type-checking means that we can encode transformations in the type signature of the output value. (Type inference is especially useful to avoid typing long type names.)

This is how we achieve "if it compiles, it's most likely correct."

### Multi (aka List)

I called this Multi rather than List to think of it less like a collection and more like a set of values from applying a function on an input. Applying a function that takes one input and outputs a Multi via flatMap giving it a Multi to start with will result in a flat Multi that has all the outputs from all the function applications concatenated.

### Maybe (aka Optional)

An optional value is exactly like a list that is only allowed to have zero or one elements.

At first it might seem a bit much to use flatMap instead of a simple if-statement for this case but there are advantages.

```
()  represents Nothing (an empty Maybe)
(v) represents Some value v
```
```
(4).flatMap(positive_square_root)
=> (2)
```
```
(-4).flatMap(positive_square_root)
=> ()
```
```
().flatMap(positive_square_root)
=> ()
```
Another way to think of a Maybe value is one where a function is only defined for certain inputs and may not return a value.
```
(4).flatMap(positive_square_root).flatMap(positive_square_root)
=> ()  # say positive_square_root only deals with whole numbers so doesn't compute root of 2
```
Notice how we expressed the chain of computations without interspersing conditional logic.

### Result (aka Either)

A Result type sometimes called Either (where one side is a value and the other possibility is an error) is like the Maybe type in that it may or may not have a value. In the case it doesn't have a value, it can contain error information as to why/where a chain of computations failed to produce a value.
```
<|v>  represents the value v
<"this is an error"|> represents an error
```
```
<|4>.flatMap(positive_square_root).flatMap(positive_square_root)
=> <"couldn't take square root of 2"|>
# using a different version of posititive_square_root that returns a Result<string, integer>
```
I'm following the common convention of putting the value on the right as is done with Either (right-biased). My natural instinct is to put the value first then the error so I might change this and this message will disappear from the README.

### Async (aka Future/Promise)

What's in a name? Async/await, Promise, or Future value are all about the same thing. Why do we have so many names for one thing? It depends on which side of the coin you're looking at. From the producer side you're promising a value to be delivered later. When I think promise I think guarantee which this isn't. More like real-life promises which get broken all the time.

From the consumer perspective, you're not on the hook to deliver anything you're just expecting a value some time in the future.

As you know `async` and `await` are the keywords JavaScript/TypeScript use as syntactic sugar when using promises. Async marks the function as returning a Promise; await is used on the caller side. We can instead use `flatMap` for handling future/promised values in the same way as we handle `Maybe`, `Result`, or `Multi` values.
