# You might not want Rxjs

<Badge type="info" text="published on 2023-02-10" />

::: info
Cross posted from the [Cloudflight engineering blog](https://engineering.cloudflight.io/you-might-not-want-rxjs).
:::

State management solutions are usually tied to some change propagation mechanism. This comes from what the framework supports most of the time. So for Angular, it would be Rxjs and the composition API for Vue.js. React does not directly enforce a solution onto you, thus leaving a lot of room of exploration to the user. The most popular ones are nonetheless written with Rxjs.

I am, however, not convinced that Rxjs should be used for state management solutions. A store is basically a `BehaviorSubject` with some niceties around it. The following code is thus good enough to demonstrate the reason for my view point:

```typescript
const store$ = new BehaviorSubject(someValue);

const derived$ = store$.pipe(
    // ... some operators later
    switchMap(async value => {
        return await asyncCall(value);
    })
);

// somewhere else
const derivedValue = await firstValueFrom(derived$);
```

Can you spot the bug here? When we try to get the value out of the observable, we might be reading stale data, because the promise has not been resolved yet. It is like eventually consistent databases, where a read directly after writing does not guarantee the latest changes are available.

This leads to incorrect data being constructed and persisted that sometimes happens in production, but is rarely reproducible in the dev environment, because the async calls are being resolved fast enough.

The root cause is Rxjs trying to abstract over asynchronity, but does not have a system in place to tell downstream to invalidate their state. There is no way to know whether the value we just read is really up-to-date.

Why would we want to get the value out of the observable? Reading data from the store and working with it on user action is very common. This is especially true for big and complex applications, where multiple layers of abstractions are build on top of the store with Rxjs pipes and combinatorics.

“This is not the reactive way” you might say, in which case you are absolutely correct. The reactive way, however, does not solve our real world requirements.

## Considered Solutions

Many ideas have been considered in how we can fix this problem, and none of them are without drawbacks.

### Blocking User Interaction

The idea is to block the user interaction until the action has been completed. The bad UX aside, having a `combineLatest` somewhere could unblock the application too early. The reason this can occur is due to `combineLatest` using stale data itself.

### Processing Queue for User Actions

Another similar approach is queuing user actions, waiting for the previous action to finish and then start processing the next one. Since the next action might need to read data from the abstractions we have built with Rxjs, this can only work if we know when the state has become consistent, which is the very issue we are trying to solve in the first place.

### No Reads After Writes

Writing to the store is only allowed at the end of the action. This prevents reading stale data within the context of that action. However, what if the user clicks around very fast? We would get stale data which should have been properly updated by the previous action.

### Disallow De-Coloring Promises

We would get `Observable<Promise<T>>` instead of `Observable<T>` and all operators like `debounceTime`, combining `switchMap` with async functions are forbidden. The changes are pushed to downstream immediately and only needs additional `await`s. This is the most attractive solution in my eyes. Downside would be a lot of features from Rxjs get disabled and increased mental overhead because of mixing promises and observables together.

### Is there a way to fix the behavior in Rxjs itself?

Rxjs can implement a way to invalidate downstream data. There would be, however, a lot of edge cases. What should be the behavior of something like `shareReplay(10)`? What should be invalidated there? I think this approach would lead to fundamental redesign of Rxjs and might not be feasible.

## Closing Words

I am open to ideas for how we can deal with this issue properly. Up until then, I would not recommend Rxjs based state management solutions for any applications of reasonable size.

