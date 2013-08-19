
# half.js

A javascript library to navigate through a web of [half](https://github.com/jmettraux/half) documents.

Depends on [jQuery](http://jquery.com).

There's currently no intention of implementing the whole of HALf.


## usage

half.js comes as a library. The entry point is the ```Half``` object.

The ```Half``` object sports two conveniences methods which return/produce "half docs".

Half docs are plain javascript objects (HAL flavoured) with extra methods for navigating the web they come from (or point to).

### Half.wrap

Wraps a plain document and returns a HalfDoc instance.

This method is mostly useful for testing, but is available anyway.

```javascript
var d =
  { name: "my stuff",
    _links: { self: { href: 'http://example.com/my_stuff' } } };

var hd = Half.wrap(d);

hd.uri('self')
  // --> "http://example.com/my_stuff"
```

### Half.go

This method is used to got to the initial endpoint:

```javascript
Half.go(
  'http://example.com/api/',
  function(doc) {
    // success
  },
  function(err) {
    // failure
  });
```

It can be used synchronously (this monopolizes the page loading):

```javascript
var TheApi = Half.go('http://example.com/api');
```

It understands relative path (relative to window.location) (both when synchronous and asynchronous):

```javascript
var TheApi = Half.go('/api');
  // or
var TheApi = Half.go('../api');
  //
  // etc...
```

### halfDoc.link

Given a rel (or just its fragment), returns the corresponding link.

If the link is templated (```"templated": true```), this function will attempt to expand from ```href``` to ```uri```:

```javascript
var d = Half.wrap(
  { _links: {
    'self': {
      href: 'http://example.com/d' },
    'http://example.com/rels#toto': {
      href: 'http://example.com/t'}
  } });

d.link('self')
  // --> {
  //   rel: 'self',
  //   href: 'http://example.com/d',
  //   uri: 'http://example.com/d' }
d.link('#toto')
  // --> {
  //   rel: 'http://example.com/rels#toto',
  //   href: 'http://example.com/t',
  //   uri: 'http://example.com/t' }
```

### halfDoc.uri

TODO

### halfDoc.get

TODO

### halfDoc.post

TODO

### halfDoc.put

TO IMPLEMENT

### halfDoc.delete

TO IMPLEMENT

### halfDoc.options

TO IMPLEMENT (why not?)

### halfDoc.embeds(embKey)

Given an _embedded key, returns the list of corresponding, embedded docs, as half docs.

```javascript
var d =
  { name: "my stuff",
    _links: {
      self: { href: 'http://example.com/my_stuff' }
    },
    _embedded: {
      books: [
        { name: 'essais',
          author: 'Montaigne',
          _links: { self: { href: 'http://example.com/books/essais' } } }
        { name: 'de rerum natura',
          author: 'Lucretius',
          _links: { self: { href: 'http://example.com/books/natura' } } }
      ]
    } };

var hd = Half.wrap(d);

var books = hd.embeds('books');

books[0].uri('self')
  // --> "http://example.com/books/natura"
```

## the onError callback

TODO


## testing

To prepare the test server:
```
cd test/server && bundle install
```

To run the test server:
```
cd test/server && bundle exec ruby server.rb
```

Then point your browser to test/test.html


## misc

This repository includes the Google Closure compiler jar as a build tool (Apache licensed).


## license

MIT (see [LICENSE.txt](LICENSE.txt)).

