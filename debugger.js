(function(){

if (window['loadFirebugConsole'] && typeof console === 'undefined') {
	// Firebug 1.2+ fix
	// http://www.codecouch.com/2008/10/referenceerror-console-is-not-defined/
	window.loadFirebugConsole();
} else if (typeof console === 'undefined') {

	var methods = [
		'log',
		'info',
		'log',
		'debug',
		'info',
		'warn',
		'error',
		'assert',
		'dir',
		'dirxml',
		'trace',
		'group',
		'groupEnd',
		'groupCollapsed',
		'time',
		'timeEnd',
		'profile',
		'profileEnd'
	];

	window.console = {};

	if (window.opera && opera.postError) {
		for (var i=0; i<methods.length; i++) {
			if (!console[methods[i]]) {
				console[methods[i]] = opera.postError;
			}
		}
	} else if (document.body) {
		var firebug=document.createElement('script');
		firebug.setAttribute('src', 'http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js');
		document.body.appendChild(firebug);
		(function(){
			if (window.pi && window.firebug) {
				firebug.init();
			} else {
				setTimeout(arguments.callee);
			}
		})()
	} else if (alert) {
		for (var i=0; i<methods.length; i++) {
			if (!console[methods[i]]) {
				console[methods[i]] = function(arg) {
					alert(methods[i] +': '+ arg);
				}
			}
		}
	}
}
})()
