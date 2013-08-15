
//
// testing half.js
//
// Wed Aug 14 14:43:11 JST 2013
//


//
// Half.wrap(doc)

test('Half.wrap(doc) returns a doc with half functions', function() {

  var d0 = { _links: { self: { href: 'http://example.com/d0' } } };

  var d1 = Half.wrap(d0);

  equal(d1.link('self'), 'http://example.com/d0')
});


//
// Half.go(http://example.org)

asyncTest('Half.go(uri, os, oe) GETs a new doc', function() {

  Half.go(
    'http://localhost:4567',
    function(doc) {
      //console.log(JSON.stringify(doc));
      equal(
        doc.link('self'),
        'http://localhost:4567/')
      start();
    },
    function(d, jqxhr, status, err) {
      console.log([ "error", d, status, err ]);
      equal(false, true);
      start();
    });
});

test('Half.go(uri, true) GETs a new doc (synchronous)', function() {

  var doc = Half.go('http://localhost:4567')

  //console.log(JSON.stringify(doc));
  equal(
    doc.link('self'),
    'http://localhost:4567/')
});


//
// halfDoc.link(rel)

test('halfDoc.link(rel) returns undefined if there are no _links', function() {

  var d = Half.wrap({});

  equal(d.link('nada'), undefined)
});

test('halfDoc.link(rel) returns undefined if no link was found', function() {

  var d = Half.wrap({ _links: {} });

  equal(d.link('nada'), undefined)
});

test('halfDoc.link(rel) returns the matching link', function() {

  var d = Half.wrap({ _links: { self: { href: 'http://example.com/d' } } });

  equal(d.link('self'), 'http://example.com/d');
});

test('halfDoc.link(#rel) returns the matching link', function() {

  var d = Half.wrap(
    { _links: { 'http://example.com/rels#toto': { href: 'http://example.com/t'} } }
  );

  equal(d.link('#toto'), 'http://example.com/t');
});

test('halfDoc.link(uri#rel) returns the matching link', function() {

  var d = Half.wrap(
    { _links: { 'http://example.com/rels#toto': { href: 'http://example.com/t'} } }
  );

  equal(d.link('http://example.com/rels#toto'), 'http://example.com/t');
});


//
// halfDoc.link(rel, values)

test('halfDoc.link(rel, values) returns the expanded link', function() {

  var d = Half.wrap(
    { _links: {
      region: {
        href: 'http://example.com/{country}/{region}',
        templated: true } } });

  equal(
    d.link('region', { country: 'jp', region: 'michinoku' }),
    'http://example.com/jp/michinoku');
});


//
// halfDoc.get(rel, params, onSuccess, onError)

asyncTest('halfDoc.get(rel, params, os, oe) GETs a new doc', function() {

  var d0 =
    Half.wrap({ _links: { doc: { href: 'http://localhost:4567/doc' } } });

  //console.log(JSON.stringify(d0));

  d0.get(
    'doc',
    null,
    function(data) {
      //console.log(JSON.stringify(data));
      equal(
        JSON.stringify(data),
        '{"name":"the doc",' +
        '"_links":{"self":{"href":"http://localhost:4567/doc"}}}')
      start();
    },
    function(d, jqxhr, status, err) {
      console.log([ "error", d, status, err ]);
      equal(false, true);
      start();
    });
});


//
// halfDoc.post(rel, params, data, onSuccess, onError)

asyncTest('halfDoc.post(rel, params, data, os, oe) GETs a new doc', function() {

  var d0 = Half.go('http://localhost:4567')

  d0.post(
    'docs',
    null,
    { id: 'dublin1', name: 'nada' },
    function(doc) {
      //console.log(doc);
      equal(doc.message, 'ok')
      start();
    },
    function(d, jqxhr, status, err) {
      console.log([ "error", d, status, err ]);
      equal(false, true);
      start();
    });
});

