# localstory

![](https://img.shields.io/npm/v/localstory.svg) ![](https://img.shields.io/badge/status-awesome-blue.svg)

A lightweight wrapper around local/sessionStorage APIs, featuring

- namespaces
- TTL expiration
- silent failures for storage API (avoid try/catch)
- zero dependencies

```
npm install localstory
```

## Tests

Run with `npm test`. Uses [tape](http://ghub.io/tape). 

## Usage

```javascript

const localstory = require('localstory')
const store = localstory(window.localStorage)

store.set('foo', 'bar')

store.get('foo') // 'bar'

store.unset('foo')

store.keys() // ['foo']

store.unset('foo')

store.clear()

// Namespaces

const storeA = localstory(window.localStorage, 'horses')
const storeB = localstory(window.localStorage, 'ponies')

storeA.set('foo', 'bar')
storeB.get('foo') // undefined

storeB.set('foo', 'baz')

storeA.get('foo') // 'bar'
storeB.get('foo') // 'baz'

// TTL expiration

store.set('foo', 'bar', { ttl: 1000 * 60 * 60 }) // 1 hour

store.get('foo') // 'bar'
store.get('foo') // one hour later... undefined

// also accepts human readable format: [s]econds, [m]inutes, [h]ours, [d]ays
store.set('foo', 'bar', { ttl: '1h' })

store.vacuum() // removes all expired keys
```
