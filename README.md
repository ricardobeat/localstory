# localstory

![NPM version](https://img.shields.io/npm/v/localstory.svg)
![Build status](https://travis-ci.org/ricardobeat/localstory.svg?branch=master)

A lightweight (0.8kb) wrapper around browser storage APIs (localStorage / sessionStorage).

## Features

- namespaces to avoid key collisions
- per-value TTL expires
- safe API (avoids throwing errors)
- zero dependencies

```
npm install localstory
```

## Usage

```javascript
const store = require('localstory')(window.localStorage, 'myNamespace', { ttl: '45m' })

store.set('foo', 'bar')
store.get('foo') // 'bar'
store.unset('foo')

store.keys() // ['foo']
store.clear()
```

## Namespacing

Use namespaces to freely use IDs without fear of collisions between different applications/stores in the same domain.

```javascript
const horses = localstory(window.localStorage, 'horses')
const ponies = localstory(window.localStorage, 'ponies')

horses.set('name', 'Thunder')
ponies.get('name') // undefined

ponies.set('name', 'Sparkle')

horses.get('name') // 'Thunder'
ponies.get('name') // 'Sparkle'
```

## Expiry / TTL

Automatically expire values. Expiry is validated on reads and once on load (can be disabled with `vacuum: false`). Each key can have it's own expiry time.

To enable, provide `{ ttl: [milliseconds] }` as second parameter to the `set()` method:

```javascript
store.set('foo', 'bar', { ttl: 1000 * 60 * 60 /* 1 hour */ })

store.get('foo') // 'bar'
store.get('foo') // one hour later... undefined

// time parameter takes human readable strings: [s]econds, [m]inutes, [h]ours, [d]ays
store.set('foo', 'bar', { ttl: '1h' })

store.vacuum() // removes all expired keys

// disable automatic vacuum on startup
const store = localstory(localStorage, 'namespace', { vacuum: false })

// set custom delay (in ms) for vacuum on startup
const store = localstory(localStorage, 'namespace', { vacuum: 15000 })
```

### Tests

Uses the [tape](http://ghub.io/tape) test runner. Run tests with `npm test` after installing dependencies.

### Contributing

https://github.com/ricardobeat/localstory

Made by [Ricardo Tomasi](http://github.com/ricardobeat)
