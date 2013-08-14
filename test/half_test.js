
//
// testing half.js
//
// Wed Aug 14 14:43:11 JST 2013
//

test('Half.wrap(doc) returns a doc with half functions', function() {

  var d0 = { _links: { self: 'http://example.com/d0' } };

  var d1 = Half.wrap(d0);

  equal('http://example.com/d0', d1.link('self'));
});

