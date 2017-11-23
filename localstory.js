/**

localstory
==========

A lightweight wrapper around browser *Storage APIs

@author Ricardo Tomasi <ricardobeat@gmail.com>
@link http://github.com/ricardobeat/localstory

Usage:

    const store = require('localstory')(window.localStorage, 'mynamespace', { ttl: '2h' })

    store.set('foo', 'bar')
    store.get('foo') -> 'bar'
    store.unset('foo')
    store.keys() -> ['foo']
    store.unset('foo')
    store.clear()

*/

function serialize (value, options) {
    return JSON.stringify({
        _value: value,
        _expires: Date.now() + timeInMs(options.ttl)
    });
}

function timeInMs (ttl) {
    if (typeof ttl === 'number') {
        return ttl;
    } else if (typeof ttl === 'string') {
        var matches = ttl.toLowerCase().replace(',', '.').match(/^([\d.]+)([smhd])$/);
        if (matches) {
            var value = Number(matches[1]), unit = matches[2];
            switch (unit) {
                case 's': return value * 1000;
                case 'm': return value * 1000 * 60;
                case 'h': return value * 1000 * 60 * 60;
                case 'd': return value * 1000 * 60 * 60 * 24;
                default : return null;
            }
        }
    } else {
        return 0;
    }
}

function supportsStorage (store) {
    try {
        store.setItem('_', '_');
        store.removeItem('_');
        return true;
    } catch (e) {
        return false;
    }
}

var safe = function (fn) {
    return function () {
        try { return fn.apply(this, arguments); } catch (e) { return undefined; }
    }
}

function createStorage (store, ns, config) {
    config || (config = {});

    var PREFIX = '_' + (ns || 'bs') + '_';

    if (!supportsStorage(store)) {
        safe = function () { return function () {}; }
    }

    var defaultOptions = {
        ttl: '90d'
    };

    var story = {

        get: safe(function (key) {
            var value = store.getItem(PREFIX + key);
            if (value) {
                var ret = JSON.parse(value.slice(PREFIX.length));
                if (ret._expires <= Date.now()) {
                    return store.removeItem(PREFIX + key);
                } else {
                    return ret._value;
                }
            }
        }),

        set: safe(function (key, value, _options) {
            var options = Object.assign(defaultOptions, _options);
            store.setItem(PREFIX + key, PREFIX + serialize(value, options));
        }),

        unset: safe(function (key) {
            store.removeItem(PREFIX + key);
        }),

        has: safe(function (key) {
            return store.getItem(PREFIX + key).indexOf(PREFIX) === 0;
        }),

        clear: safe(function () {
            return this.keys()
                .filter(this.has.bind(this))
                .forEach(this.unset.bind(this));
        }),

        vacuum: safe(function () {
            this.keys().forEach(this.get.bind(this));
        }),

        keys: safe(function () {
            var keys = [];
            for (var i = 0; i < store.length; i++) {
                var key = store.key(i);
                if (key.indexOf(PREFIX) === 0) keys.push(key.slice(PREFIX.length));
            }
            return keys;
        }),

        values: safe(function () {
            return this.keys().map(this.get.bind(this))
        })
    }

    if (config.vacuum !== false) {
        setTimeout(function () {
            if (typeof requestIdleCallback === 'function') {
                requestIdleCallback(function(){ story.vacuum() })
            } else {
                story.vacuum();
            }
        }, +config.vacuum || 8000);
    }

    return story;
}

module.exports = createStorage;
