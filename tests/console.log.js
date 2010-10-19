module('log');

console._output = function(arg){
  return arg;
};

test('Boolean', function(){
  equals(console.log(true), 'true');
  equals(console.log(false), 'false');
  equals(console.log(new Boolean(false)), 'Boolean false');
  equals(console.log(new Boolean(true)), 'Boolean true');
});

test('Strings', function(){
  equals(console.log('Hello!'), 'Hello!');
  var long_str = "Either the well was very deep, or she fell very slowly, for she had plenty of time as \n\
  she went down to look about her and to wonder what was going to happen next. First, she tried to look down and \n\
  make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, \n\
  and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung \n\
  upon pegs. She took down a jar from one of the shelves as she passed; it was labelled `ORANGE MARMALADE', but to \n\
  her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed \n\
  to put it into one of the cupboards as she fell past it.";
  equals(console.log(long_str), long_str);
  equals(console.log(" "), ' ');
  var strObj = new String('A');
  strObj.foo = "FUU!";
  equals(console.log(strObj), 'String "A"');
});

test('Numbers', function(){
  equals(console.log(0), '0');
  equals(console.log(1), '1');
  equals(console.log(.283679), '0.283679');
  equals(console.log(Infinity), 'Infinity');
  equals(console.log(NaN), 'NaN');
  var numObj = new Number(42);
  numObj.twenty = 20;
  equals(console.log(numObj), 'Number 42');
});

test('Arrays', function(){
  equals(console.log([]), "[]");
  equals(console.log([2]), "[2]");
  equals(console.log(['Yada-yada']), '["Yada-yada"]');
  equals(console.log([1, 'Yada-yada']), '[1, "Yada-yada"]');
  equals(console.log([[1], 'Yada-yada']), '[[1], "Yada-yada"]');
  equals(console.log([1, ['Yada-yada']]), '[1, ["Yada-yada"]]');
  equals(console.log([1, [2, [3]]]), "[1, [2, [3]]]");
  equals(console.log([532, 94, [13, [41, 0]], [], 49]), "[532, 94, [13, [41, 0]], [], 49]");
  equals(console.log(new Array(2,-3,4)), '[2, -3, 4]');
});

test('HTMLCollection', function(){
  ok(console.log(document.body.children).indexOf('HTMLCollection [') === 0, 'document.body.children looks like array');
  ok(console.log(document.plugins).indexOf('HTMLCollection [') === 0, 'document.plugins look like array');
});

test('NodeList', function(){
  ok(console.log(document.body.childNodes).indexOf('NodeList [') === 0, 'Looks like array');
});

test('Objects', function(){
  equals(console.log({}), '{}');
  equals(console.log({name:'Nikita'}), '{"name": "Nikita"}');
  equals(console.log({name:'Nikita', surname:'Vasilyev'}), '{"name": "Nikita", "surname": "Vasilyev"}');
  equals(console.log({age: 21, name:'Nikita', surname:'Vasilyev'}), '{"age": 21, "name": "Nikita", "surname": "Vasilyev"}');
  equals(console.log({down: {to: {rabbit: {hole:1}}}}), '{"down": {?}}');
});

test('Constructor object', function(){
  function Mammal(){
    this.eats = 'Milk';
  }
  function Dog(){
    this.legs = 4;
  }
  Dog.prototype = new Mammal;
  equals(console.log(new Dog), '{"legs": 4}');
});

if (Object.defineProperty) {
  test('Innumerable object', function(){
    var inenum = Object.defineProperty({a: 1}, "b", {value: 37, enumerable: false});
    equals(console.dir(inenum), '{\n  "a": 1, \n  "b": 37\n}');
  });
}

test('Elements', function(){
  equals(console.log(document.body).toLowerCase(), '<body id="qunit-wrapper">');
  equals(console.log(document.getElementById('qunit-header')), '<H1 id="qunit-header">');
  equals(console.log(document.createElement('IMG')), '<IMG/>');
});


test('Functions', function(){
  function foo(/*bar*/) {
    //buz
  }
  equals(console.log(foo), foo.toString());
  equals(console.log(new Function('return 2*3')), new Function('return 2*3'));
});

test('RegExps', function(){
  equals(console.log(/.+/), '/.+/');
  equals(console.log(new RegExp('.+')), '/.+/');
  var start_tag = /^<(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
  equals(console.log(start_tag), '/'+start_tag.source+'/');
});

test('Date', function(){
  var date = new Date;
  equals(console.log(date), date.toString());
});


test('String interpolation', function(){
  equals(console.log('foo %s buzz', 'bar'), 'foo bar buzz');
  equals(console.log('foo %i buzz', 123), 'foo 123 buzz');
  equals(console.log('foo %f buzz', 9.8), 'foo 9.8 buzz');
  equals(console.log('foo %f buzz %syada', 9.8, 'yada-'), 'foo 9.8 buzz yada-yada');
  equals(console.log('foo %o buzz', {a:'foo'}), 'foo {"a": "foo"} buzz');
  equals(console.log('%s', 'a', 'b', 'c'), 'a\nb\nc');
});
