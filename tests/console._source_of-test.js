module('console._source_of()');

test('Strings', function(){
  equals(console._source_of('Hello!'), '"Hello!"');
  equals(console._source_of(new String('Hello!')), '"Hello!"');
  equals(console._source_of("Either the well was very deep, or she fell very slowly, for she had plenty of time as \n\
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
  equals(console._source_of(" "), '" "');
});

test('Numbers', function(){
  equals(console._source_of(0), '0');
  equals(console._source_of(1), '1');
  equals(console._source_of(.283679), '0.283679');
  equals(console._source_of(Infinity), 'Infinity');
  equals(console._source_of(NaN), 'NaN');
});

test('Arrays', function(){
  equals(console._source_of([]), "[]");
  equals(console._source_of([1]), "[1]");
  equals(console._source_of(['Yada-yada']), '["Yada-yada"]');
  equals(console._source_of([1, 'Yada-yada']), '[1, "Yada-yada"]');
  equals(console._source_of([[1], 'Yada-yada']), '[[1], "Yada-yada"]');
  equals(console._source_of([1, ['Yada-yada']]), '[1, ["Yada-yada"]]');
  equals(console._source_of([1, [2, [3]]]), "[1, [2, [3]]]");
  equals(console._source_of([532, 94, [13, [41, 0]], [], 49]), "[532, 94, [13, [41, 0]], [], 49]");
  equals(console._source_of(new Array(2,-3,4)), '[2, -3, 4]');
});

test('HTMLCollection', function(){
  ok(console._source_of(document.body.children).indexOf('[') === 0, 'document.body.children looks like array');
  ok(console._source_of(document.plugins).indexOf('[') === 0, 'document.plugins look like array');
});

test('NodeList', function(){
  ok(console._source_of(document.body.childNodes).indexOf('[') === 0, 'Looks like array');
});

test('Objects', function(){
  equals(console._source_of({name:'Nikita'}), '{\n  "name": "Nikita"\n}');
  equals(console._source_of({name:'Nikita', surname:'Vasilyev'}), '{\n  "name": "Nikita", \n  "surname": "Vasilyev"\n}');
  equals(console._source_of({age: 21, name:'Nikita', surname:'Vasilyev'}), '{\n  "age": 21, \n  "name": "Nikita", \n  "surname": "Vasilyev"\n}');
  console.dimensions_limit = 1;
  equals(console._source_of({down: {to: {rabbit: {hole:1}}}}), '{\n  "down": {?}\n}');
  console.dimensions_limit = 2;
  equals(console._source_of({down: {to: {rabbit: {hole:1}}}}), '{\n  "down": {\n    "to": {?}\n  }\n}');
  console.dimensions_limit = 3;
  equals(console._source_of({down: {to: {rabbit: 'hole'}}}), '{\n  "down": {\n    "to": {\n      "rabbit": "hole"\n    }\n  }\n}');
  var n = new Number(1);
  n.x = 2;
  equals(console._source_of(n), '{\n  "x": 2\n}');
  ok(console._source_of(document).indexOf('{') === 0, 'Looks like an object');
  ok(console._source_of(window).indexOf('{') === 0, 'Looks like an object');
});

test('Functions', function(){
  function foo(/*bar*/) {
    //buz
  }
  equals(console._source_of(foo), foo.toString());
  equals(console._source_of(new Function('return 2*3')), new Function('return 2*3'));
});

test('Elements', function(){
  equals(console._source_of(document.body).toUpperCase(), '<BODY ID="QUNIT-WRAPPER">');
  equals(console._source_of(document.getElementById('qunit-header')), '<H1 id="qunit-header">');
  equals(console._source_of(document.createElement('IMG')), '<IMG/>');
});

test('RegExps', function(){
  equals(console._source_of(/.+/), '/.+/');
  equals(console._source_of(new RegExp('.+')), '/.+/');
  var start_tag = /^<(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
  equals(console._source_of(start_tag), '/'+start_tag.source+'/');
});

test('Misc', function(){
  equals(console._source_of(undefined), 'undefined');
  equals(console._source_of(null), 'null');
  equals(console._source_of(true), 'true');
  equals(console._source_of(false), 'false');
  var date = new Date;
  equals(console._source_of(date), date.toString());
});

test('Recursive objects', function(){
  console.dimensions_limit = 5;
  var obj = {a: 1};
  obj.root = obj;
  equals(console._source_of(obj), '{\n  "a": 1, \n  "root": #\n}');
  var obj2 = {a: {b: 1}};
  obj2.a.root = obj2;
  equals(console._source_of(obj2), '{\n  "a": {\n    "b": 1, \n    "root": #\n  }\n}');
  equals(console._source_of(obj2.a), '{\n  "b": 1, \n  "root": {\n    "a": #\n  }\n}');
});