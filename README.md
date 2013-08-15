
# half.js

A javascript library to navigate through a web of [half](https://github.com/jmettraux/half) documents.

Depends on [jQuery](http://jquery.com).

There's currently no intention of implementing the whole of HALf.


## usage

half.js comes as a library. The entry point is the ```Half``` object.

The ```Half``` object sports two conveniences methods which return/produce "half docs".

Half docs are plain javascript objects (HAL flavoured) with extra methods for navigating the web they come from (or point to).

### Half.wrap

TODO

### Half.go

TODO

### halfDoc.get

TODO

### halfDoc.post

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

