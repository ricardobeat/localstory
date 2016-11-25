
const tapeTest = require('tape')
const localstory = require('../')

if (typeof localStorage === 'undefined') {
    localStorage = require('localstorage-memory')
}

var key = 'hello'
var val = 'world'
var store = localstory(localStorage)

// clear localStorage before every test
const test = Object.assign(function (name, fn) {
    tapeTest(name, t => {
        localStorage.clear()
        fn(t)
    })
}, tapeTest)

test('api', t => {
    t.plan(4)

    t.equal(typeof store.get, 'function')
    t.equal(typeof store.set, 'function')
    t.equal(typeof store.unset, 'function')
    t.equal(typeof store.clear, 'function')
})

test('get / set item', t => {
    t.plan(1)

    store.set(key, val)

    t.equal(store.get(key), val)
})

test('get / set number', t => {
    t.plan(2)

    store.set(key, Math.PI)

    t.equal(typeof store.get(key), 'number')
    t.equal(store.get(key), Math.PI)
})

test('get / set array', t => {
    t.plan(2)

    const arr = [1, 2, { 4: 5 }];
    store.set(key, arr)

    t.equal(typeof store.get(key), 'object')
    t.deepEqual(store.get(key), arr)
})

test('get / set object', t => {
    t.plan(2)

    const obj = { test: 'yes' }
    store.set(key, obj)

    t.equal(typeof store.get(key), 'object')
    t.deepEqual(store.get(key), obj)
})

test('remove item', t => {
    t.plan(2)

    store.set(key, val)
    t.equal(store.get(key), val)

    store.unset(key)
    t.equal(store.get(key), undefined)
})

test('expires', t => {
    t.plan(2)

    store.set(key, val, { ttl: 50 })

    setTimeout(_ => t.equal(store.get(key), val), 30)
    setTimeout(_ => t.equal(store.get(key), undefined), 100);
})

test('namespaces', t => {
    t.plan(4)

    const s1 = localstory(localStorage, 'a')
    const s2 = localstory(localStorage, 'b')

    s1.set(key, 11)
    s2.set(key, 22)

    t.equal(s1.get(key), 11)
    s1.unset(key)

    t.equal(s2.get(key), 22)
    s2.unset(key)

    t.equal(s1.get(key), undefined)
    t.equal(s2.get(key), undefined)
})

test('clear', t => {
    t.plan(6)

    store.set('a', 1)
    store.set('b', 2)
    store.set('c', 3)

    t.equal(store.get('a'), 1)
    t.equal(store.get('b'), 2)
    t.equal(store.get('c'), 3)

    store.clear()

    t.equal(store.get('a'), undefined)
    t.equal(store.get('b'), undefined)
    t.equal(store.get('c'), undefined)
})

test('keys', t => {
    t.plan(1)

    store.clear()
    store.set('a', 1)
    store.set('b', 2)
    store.set('c', 3)

    t.deepEqual(store.keys(), ['a', 'b', 'c'])
})