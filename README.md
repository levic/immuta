## Immuta

### UNFINISHED

Immuta is the son of Immer, a simple immutable library. Immuta was born out of the desire to build a state management & subscription system for React that could be far more efficient than current solutions. It provides the ability to receive the exact values within your state that were changed on each mutation while remaining performant and lean.

> This library is **heavily** inspired by the awesome [immer](https://github.com/mweststrate/immer) library. It adds the "onChange" handler, rollbacks, change snapshots, and support for ES6 Maps & Sets. Most of these changes were built to provide a performant and flexible state management library when used in conjunction with [state-modules](https://github.com/odo-network/state-modules).

### Installation

```
yarn add immuta
```

**or**

```
npm i --save immuta
```

### Flow Coverage

This library aims to provide 100% FlowType Coverage.

### Reference

#### immuta `default export`

##### Example

```javascript
import immuta from "immuta";

const state = {
  foo: "bar"
};

const nextState = immuta(
  // provide the state to start with
  state,
  // draft is a proxy that will copy-on-write
  draft => {
    draft.foo = "baz";
  },
  // optional callback for change events
  (changedState, changedMap, rollback) => {
    // rollback() will cancel the changes and return original object
    // changedMap is Map { ['path.to.change']: changedValue }
    // changedState is the new state being returned to caller (nextState)
  }
);

console.log(nextState === state); // false
```
