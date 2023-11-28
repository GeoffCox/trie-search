# @geoffcox/binary-search

This library contains a binary search algorithm written in Typescript.

## Features

* The search method supports any time of items in the array.
* The comparison function is injected into the algorithm.
* When the value is not found, the search provides the nearest range where the value should have been found.

This package ships in ES and CommonJS module formats along with DTS for typing.

## Installation and Usage

```
npm install @geoffcox/binary-search
```

```ts
    const values = [1,2,3,4,5];
    const nearestRange: NearestRange = {};

    const compare = (a: number, b: number) => a-b;
    const result = binarySearch(4, values, compare, nearestRange);

    //expect result to be index of 3 and nearestRange to be [2,4]
```

## Demo

Enjoy it at http://geoffcox.github.io/demos/binary-search

