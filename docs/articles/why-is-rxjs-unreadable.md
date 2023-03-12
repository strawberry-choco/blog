---
title: Why is Rxjs unreadable?
date: 2022-08-16
---

# Why is Rxjs unreadable?

<Badge type="info" text="published on 2022-08-16" />

::: info
Cross posted from the [Cloudflight engineering blog](https://engineering.cloudflight.io/food-for-thought-why-is-rxjs-unreadable).
:::

RxJS has become quite popular in the frontend field, and a lot of people use it in combination with React and VueJS. Nonetheless, fully diving into the reactive approach of RxJS can yield a lot of unreadable code. Let's explore why that is the case.

RxJS has the concept of an observable, which gives us values over time. You can think of it as having a variable that tells us its value has changed, or simply as a stream. All kinds of operations can be applied on top of it with the `.pipe` method.

```typescript
const value$ = new BehaviorSubject(9000);

const transformedValue$ = value$.pipe(
  map((value) => {
    // ...
  }),
  filter((value) => {
    // ...
  })
);
```

Everything looks fine so far, but what if we have complex calculations or need to combine multiple observables?

```typescript
const transformedValue1$ = combineLatest([
    value1$,
    value2$
]).pipe(
    switchMap(([value1, value2]) => {
        const value3$ = // ...

        return withLatestFrom(value3$).pipe(
            map(value3 => {
                // ...
            })
        )
    }),
    // ...
)

const transformedValue2$ = combineLatest([
    transformedValue1$,
    value4$
]).pipe(
    map(([transformedValue1, value4]) => {
        // ...
    })
)
```

As you can see, the code becomes quite confusing pretty fast. And we haven't started adding more combinatorics to the pipe yet. The culprit here is “callback hell”. Promises had the same issue with chained `.then` and returning promises inside. That led to a lot of nesting and hard to follow code, since the logic that should belong together are found at places with different indents or even not in the same `.then` block at all. In the aforementioned example, you can see there is a variable called `transformedValue1$`, which exists simply to spit up the complexity of the whole transformation.

So how did promises solve the callback hell problem? JavaScript introduced new syntax to the language called `async/await`. Instead of chaining .then we can just use await and the value we want will be “unwrapped” for us. The new syntax turned what is previously chained and nested code into procedural code.

```typescript
promise
    .then(value => {
        return fetch(...).then(nestedValue => {
            // ...
        })
    })
    .then(value => {
        // ...
    })

// turns into

const value1 = await promise
const value2 = await fetch(...)
const value3 = await // ...
const value4 = await // ...
```

As you can see, there is no nesting and the logic is not scattered all over the place anymore. Now the question becomes can we do something similar to RxJS? For that, we can take a look at Svelte.

```typescript
$: reactiveValue = doSomeStuff(foo, bar);
```

With this, `reactiveValue` will be recalculated whenever `foo` or `bar` changes. We can of course go a step further:

```typescript
$: value1 = doSomeStuff(foo, bar)
$: value2 = value1 + 100
$: value3 = value2 > 9000 ? 'over 9000' : 'not enough power leveling'
$: value4 = // ...
```

Just like what `async/await` did to promises, the unconventional syntax from Svelte solved the callback hell problem for RxJS. Well, strictly speaking, anything with a `.subscribe` method works with Svelte. Thus, RxJS just happened to benefit from it. We can say `$:` is syntax sugar for `.subscribe`, just like `await` is syntax sugar for `.then` (`await` works on anything that has a `.then` method, not only promises).

The approach from Svelte only works in Svelte, though, since we need the Svelte compiler to transform the code into normal JavaScript with the same behavior. There is no custom syntax support for RxJS in normal JavaScript right now. Nonetheless, it is an interesting solution to the challenges RxJS faces.
