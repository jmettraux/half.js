
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

  equal(d1.uri('self'), 'http://example.com/d0')
});


//
// Half.go(http://example.org)

asyncTest('Half.go(uri, os, oe) GETs a new doc', function() {

  Half.go(
    'http://localhost:4567',
    function(doc) {
      //console.log(JSON.stringify(doc));
      equal(
        doc.uri('self'),
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
    doc.uri('self'),
    'http://localhost:4567/')
});


//
// halfDoc.uri(rel)

test('halfDoc.uri(rel) returns undefined if there are no _links', function() {

  var d = Half.wrap({});

  equal(d.uri('nada'), undefined)
});

test('halfDoc.link(rel) returns undefined if there are no _links', function() {

  var d = Half.wrap({});

  equal(d.link('nada'), undefined)
});

test('halfDoc.uri(rel) returns undefined if no link was found', function() {

  var d = Half.wrap({ _links: {} });

  equal(d.uri('nada'), undefined)
});

test('halfDoc.link(rel) returns undefined if no link was found', function() {

  var d = Half.wrap({ _links: {} });

  equal(d.link('nada'), undefined)
});

test('halfDoc.uri(rel) returns the matching link', function() {

  var d = Half.wrap({ _links: { self: { href: 'http://example.com/d' } } });

  equal(d.uri('self'), 'http://example.com/d');
});

test('halfDoc.link(rel) returns the matching link', function() {

  var d = Half.wrap({ _links: { self: { href: 'http://example.com/d' } } });

  var l = d.link('self');
  equal(l.href, 'http://example.com/d');
  equal(l.uri, 'http://example.com/d');
});

test('halfDoc.uri(#rel) returns the matching link', function() {

  var d = Half.wrap(
    { _links: { 'http://example.com/rels#toto': { href: 'http://example.com/t'} } }
  );

  equal(d.uri('#toto'), 'http://example.com/t');
});

test('halfDoc.link(#rel) returns the matching link', function() {

  var d = Half.wrap(
    { _links: { 'http://example.com/rels#toto': { href: 'http://example.com/t'} } }
  );

  var l = d.link('#toto');
  equal(l.uri, 'http://example.com/t');
  equal(l.href, 'http://example.com/t');
});

test('halfDoc.uri(uri#rel) returns the matching link', function() {

  var d = Half.wrap(
    { _links: { 'http://example.com/rels#toto': { href: 'http://example.com/t'} } }
  );

  equal(d.uri('http://example.com/rels#toto'), 'http://example.com/t');
});


//
// halfDoc.uri(rel, values)

test('halfDoc.uri(rel, values) returns the expanded link', function() {

  var d = Half.wrap(
    { _links: {
      region: {
        href: 'http://example.com/{country}/{region}',
        templated: true } } });

  equal(
    d.uri('region', { country: 'jp', region: 'michinoku' }),
    'http://example.com/jp/michinoku');
});

test('halfDoc.link(rel, values) returns the expanded link', function() {

  var d = Half.wrap(
    { _links: {
      region: {
        href: 'http://example.com/{country}/{region}',
        templated: true } } });

  var l = d.link('region', { country: 'jp', region: 'michinoku' })

  equal(l.href, 'http://example.com/{country}/{region}');
  equal(l.uri, 'http://example.com/jp/michinoku');
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

asyncTest('halfDoc.post(rel, params, data, os, oe) POSTs', function() {

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

asyncTest('halfDoc.post(rel, params, data, os, oe) enforces fields', function() {

  var d0 = Half.go('http://localhost:4567')

  console.log(d0);

  //d0.post(
  //  'docs',
  //  null,
  //  { id: 'dublin1', name: 'nada' },
  //  function(doc) {
  //    //console.log(doc);
  //    equal(doc.message, 'ok')
  //    start();
  //  },
  //  function(d, jqxhr, status, err) {
  //    console.log([ "error", d, status, err ]);
  //    equal(false, true);
  //    start();
  //  });
});

