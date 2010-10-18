module('dir');

test('Strings', function(){
  equals(console.dir('Hello!'), '"Hello!"');
  equals(console.dir(new String('Hello!')), '"Hello!"');
  equals(console.dir("Either the well was very deep, or she fell very slowly, for she had plenty of time as \n\
  she went down to look about her and to wonder what was going to happen next. First, she tried to look down and \n\
  make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, \n\
  and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung \n\
  upon pegs. She took down a jar from one of the shelves as she passed; it was labelled `ORANGE MARMALADE', but to \n\
  her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed \n\
  to put it into one of the cupboards as she fell past it."),
  '"Either the well was very deep, or she fell very slowly, for she had plenty of time as \n\
  she went down to look about her and to wonder what was going to happen next. First, she tried to look down and \n\
  make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, \n\
  and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung \n\
  upon pegs. She took down a jar from one of the shelves as she passed; it was labelled `ORANGE MARMALADE\', but to \n\
  her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed \n\
  to put it into one of the cupboards as she fell past it."'
  );
  equals(console.dir(" "), '" "');
});

test('Numbers', function(){
  equals(console.dir(0), '0');
  equals(console.dir(1), '1');
  equals(console.dir(.283679), '0.283679');
  equals(console.dir(Infinity), 'Infinity');
  equals(console.dir(NaN), 'NaN');
});

test('Arrays', function(){
  equals(console.dir([]), "[]");
  equals(console.dir([1]), "[1]");
  equals(console.dir(['Yada-yada']), '["Yada-yada"]');
  equals(console.dir([1, 'Yada-yada']), '[1, "Yada-yada"]');
  equals(console.dir([[1], 'Yada-yada']), '[[1], "Yada-yada"]');
  equals(console.dir([1, ['Yada-yada']]), '[1, ["Yada-yada"]]');
  equals(console.dir([1, [2, [3]]]), "[1, [2, [3]]]");
  equals(console.dir([532, 94, [13, [41, 0]], [], 49]), "[532, 94, [13, [41, 0]], [], 49]");
  equals(console.dir(new Array(2,-3,4)), '[2, -3, 4]');
});

test('HTMLCollection', function(){
  ok(console.dir(document.body.children).indexOf('[') === 0, 'document.body.children looks like array');
  ok(console.dir(document.plugins).indexOf('[') === 0, 'document.plugins look like array');
});

test('NodeList', function(){
  ok(console.dir(document.body.childNodes).indexOf('[') === 0, 'Looks like array');
});

test('Objects', function(){
  equals(console.dir({name:'Nikita'}), '{\n  "name": "Nikita"\n}');
  equals(console.dir({name:'Nikita', surname:'Vasilyev'}), '{\n  "name": "Nikita", \n  "surname": "Vasilyev"\n}');
  equals(console.dir({age: 21, name:'Nikita', surname:'Vasilyev'}), '{\n  "age": 21, \n  "name": "Nikita", \n  "surname": "Vasilyev"\n}');
  console.dimensions_limit = 1;
  equals(console.dir({down: {to: {rabbit: {hole:1}}}}), '{\n  "down": {?}\n}');
  console.dimensions_limit = 2;
  equals(console.dir({down: {to: {rabbit: {hole:1}}}}), '{\n  "down": {\n    "to": {?}\n  }\n}');
  console.dimensions_limit = 3;
  equals(console.dir({down: {to: {rabbit: 'hole'}}}), '{\n  "down": {\n    "to": {\n      "rabbit": "hole"\n    }\n  }\n}');
  var n = new Number(1);
  n.x = 2;
  equals(console.dir(n), '{\n  "x": 2\n}');
});

if (Object.defineProperty) {
  test('Innumerable object', function(){
    var inenum = Object.defineProperty({a: 1}, "b", {value: 37, enumerable: false});
    equals(console.dir(inenum), '{\n  "a": 1, \n  "b": 37\n}');
  });
}

test('document', function(){
  ok(console.dir(document).indexOf('{') === 0, 'Looks like an object');
});

test('window', function(){
  ok(console.dir(window).indexOf('{') === 0, 'Looks like an object');
});

test('Functions', function(){
  function foo(/*bar*/) {
    //buz
  }
  equals(console.dir(foo), foo.toString());
  equals(console.dir(new Function('return 2*3')), new Function('return 2*3'));
});

test('Elements', function(){
  equals(console.dir(document.body).toUpperCase(), '<BODY ID="QUNIT-WRAPPER">');
  equals(console.dir(document.getElementById('qunit-header')), '<H1 id="qunit-header">');
  equals(console.dir(document.createElement('IMG')), '<IMG/>');
});

test('RegExps', function(){
  equals(console.dir(/.+/), '/.+/');
  equals(console.dir(new RegExp('.+')), '/.+/');
  var start_tag = /^<(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
  equals(console.dir(start_tag), '/'+start_tag.source+'/');
});

test('Misc', function(){
  equals(console.dir(undefined), 'undefined');
  equals(console.dir(null), 'null');
  equals(console.dir(true), 'true');
  equals(console.dir(false), 'false');
  var date = new Date;
  equals(console.dir(date), date.toString());
});

test('Recursive objects', function(){
  console.dimensions_limit = 5;
  var obj = {a: 1};
  obj.root = obj;
  equals(console.dir(obj), '{\n  "a": 1, \n  "root": #\n}');
  var obj2 = {a: {b: 1}};
  obj2.a.root = obj2;
  equals(console.dir(obj2), '{\n  "a": {\n    "b": 1, \n    "root": #\n  }\n}');
  equals(console.dir(obj2.a), '{\n  "b": 1, \n  "root": {\n    "a": #\n  }\n}');
});