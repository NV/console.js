test("Is it the Console.js? It could be Firebug's console or WebInspector'c console.", function(){
  ok(console.toString(), 'Actually, it is: '+ console.toString());
});
