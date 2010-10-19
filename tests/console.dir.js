module('dir');

console._output = function(arg){
  return arg;
};

test('Boolean', function(){
  equals(console.dir(true), 'true');
  equals(console.dir(false), 'false');
  equals(console.dir(new Boolean(false)), 'Boolean false {}');
  equals(console.dir(new Boolean(true)), 'Boolean true {}');
});

test('Strings', function(){
  equals(console.dir('Hello!'), '"Hello!"');
  equals(console.dir(" "), '" "');
  var strObj = new String('A');
  strObj.foo = "FUU!";
  equals(console.dir(strObj), 'String "A" {\n  "0": "A", \n  "foo": "FUU!", \n  "length": 1\n}');
});

test('Numbers', function(){
  equals(console.dir(0), '0');
  equals(console.dir(1), '1');
  equals(console.dir(.283679), '0.283679');
  equals(console.dir(Infinity), 'Infinity');
  equals(console.dir(NaN), 'NaN');
  var numObj = new Number(42);
  numObj.twenty = 20;
  equals(console.dir(numObj), 'Number 42 {\n  "twenty": 20\n}');
});

test('Arrays', function(){
  equals(console.dir([]), 'Array {\n  "length": 0\n}');
  equals(console.dir([1, 'Yada-yada']), 'Array {\n  "0": 1, \n  "1": "Yada-yada", \n  "length": 2\n}');
});

test('Objects', function(){
  equals(console.dir({}), '{}');
  equals(console.dir({name:'Nikita'}), '{\n  "name": "Nikita"\n}');
  equals(console.dir({name:'Nikita', surname:'Vasilyev'}), '{\n  "name": "Nikita", \n  "surname": "Vasilyev"\n}');
  equals(console.dir({age: 21, name:'Nikita', surname:'Vasilyev'}), '{\n  "age": 21, \n  "name": "Nikita", \n  "surname": "Vasilyev"\n}');
  console.dimensions_limit = 1;
  equals(console.dir({down: {to: {rabbit: {hole:1}}}}), '{\n  "down": {?}\n}');
  console.dimensions_limit = 2;
  equals(console.dir({down: {to: {rabbit: {hole:1}}}}), '{\n  "down": {\n    "to": {?}\n  }\n}');
  console.dimensions_limit = 3;
  equals(console.dir({down: {to: {rabbit: 'hole'}}}), '{\n  "down": {\n    "to": {\n      "rabbit": "hole"\n    }\n  }\n}');
});

test('Constructor object', function(){
  function Mammal(){
    this.eats = 'Milk';
  }
  function Dog(){
    this.legs = 4;
  }
  Dog.prototype = new Mammal;
  equals(console.dir(new Dog), '{\n  "eats": "Milk", \n  "legs": 4\n}');
});

if (Object.defineProperty) {
  test('Innumerable object', function(){
    var inenum = Object.defineProperty({a: 1}, "b", {value: 37, enumerable: false});
    equals(console.dir(inenum), '{\n  "a": 1, \n  "b": 37\n}');
  });
}

test('document', function(){
  var doc = console.dir(document);
  doc = doc.slice(0, doc.indexOf("\n"));
  equals(doc, 'HTMLDocument {');
});

test('window', function(){
  var win = console.dir(window);
  win = win.slice(0, win.indexOf("\n"));
  ok(/^(Window|global) \{/.test(win), "Looks like window");
});

test('Functions', function(){
  function foo(/*bar*/) {
    //buz
  }
  var func = console.dir(foo);
  var funcString = foo.toString();
  equals(func.slice(0, func.indexOf("\n")), funcString.slice(0, funcString.indexOf("\n")));
});

test('RegExps', function(){
  var regexp = console.dir(/.+/);
  regexp = regexp.slice(0, regexp.indexOf("\n"));
  equals(regexp, "RegExp /.+/ {");
});

test('Date', function(){
  var date = new Date;
  equals(console.dir(date), "Date " + date.valueOf() + " {}");
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