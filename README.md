
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

```javascript
var d =
  { name: "my stuff",
    _links: { self: { href: 'http://example.com/my_stuff' } } };

var hd = Half.wrap(d);

hd.uri('self')
  // --> "http://example.com/my_stuff"
```

### Half.go

TODO

### halfDoc.link

TODO

### halfDoc.uri

TODO

### halfDoc.get

TODO

### halfDoc.post

TODO

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

