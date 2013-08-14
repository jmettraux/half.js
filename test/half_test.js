
//
// testing half.js
//
// Wed Aug 14 14:43:11 JST 2013
//


test('John.parse(o) atomic values', function() {

  pa('"oh yeah"', 'oh yeah');
  pa('"わしらの電車"', 'わしらの電車');
  pa('"a:b"', 'a:b');

  pa('1', 1);
  pa('1.2', 1.2);
  pa('1.2e10', 1.2e10);
  pa('-1', -1);

  pa('true', true);
  pa('false', false);

  pa('null', null);
});

