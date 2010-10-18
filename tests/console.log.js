module('console.log()');

console._output = function(arg){
  return arg;
};

test('String interpolation', function(){
  equals(console.log('foo %s buzz', 'bar'), 'foo "bar" buzz');
  equals(console.log('foo %i buzz', 123), 'foo 123 buzz');
  equals(console.log('foo %f buzz', 9.8), 'foo 9.8 buzz');
  equals(console.log('foo %f buzz %syada', 9.8, 'yada-'), 'foo 9.8 buzz "yada-"yada');
  equals(console.log('foo %o buzz', {a:'foo'}), 'foo {\n  "a": "foo"\n} buzz');
  equals(console.log('%s', 'a', 'b', 'c'), '"a"\n"b"\n"c"');
});
