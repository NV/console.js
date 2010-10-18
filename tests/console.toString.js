test("Is it the Console.js? It could be Firebug's console or WebInspector'c console.", function(){
  ok(!console.firebug, "Firebug turned off");
  ok(console.toString().indexOf("Console") > -1);
});
