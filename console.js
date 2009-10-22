if (typeof console === 'undefined') {

  /**
   * @see http://getfirebug.com/console.html
   */
  window.console = {};

  if (document.body) {

    var firebug = document.createElement('script');
    firebug.setAttribute('src', 'http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js');
    document.body.appendChild(firebug);
    (function(){
      if (window.pi && window.firebug) {
        firebug.init();
      } else {
        setTimeout(arguments.callee);
      }
    })();

  } else {

    var post = window.opera && opera.postError || alert;

    /**
     * console.log('The answer:', 42)
     * @param Objects
     */
    console.log = console.info = console.warn = console.error = console.debug = function log (){
      post( Array.prototype.join.call( arguments, "\n" ) );
    };


    /**
     * console.dir({x:2, y:8, z:[4,3]}) ==> '{ x: 2, y: 8, z: [4, 3] }'
     */
    console.dir = function dir () {

      /**
       * source_of([1, {a:2}]) === '[1, {"a": 2}]'
       * @return {String} string representation of input
       */
      var source_of = function source_of () {

        // Huge objects such as document.body blow out source_of function. This is dirty fix.
        if (!arguments.callee.calls) {
          arguments.callee.calls = 1;
        } else if (arguments.callee.calls > 5) {
          return ' ... ';
        } else {
          arguments.callee.calls++;
        }

        var result = '';
        for (var i = 0; i < arguments.length; i++) {
          if (arguments[i] && typeof arguments[i].length === 'number' && typeof arguments[i].splice === 'function') {
            result += '[';
            var arr_list = [];
            for (var j = 0; j < arguments[i].length; j++) {
              arr_list.push( source_of(arguments[i][j]) );
            }
            result += arr_list.join(', ') +']';
          } else if (typeof arguments[i] == 'object') {
            result += '{ ';
            var arr_obj = [];
            for (var key in arguments[i]) {
              if (arguments[i][key] == arguments[i]) {
                // Avoid recursive links. For example: window.self == window
                arr_obj.push( key +': __recursive_link__' );
              } else {
                arr_obj.push( key +': '+ source_of(arguments[i][key]) );
              }
            }
            result += arr_obj.join(', ') +' }';
          } else if (typeof arguments[i] == 'string') {
            return "'"+ arguments[i] +"'";
          } else {
            return arguments[i];
          }
        }
        return result;
      };

      for (var i=0; i<arguments.length; i++) {
        post( source_of(arguments[i]) );
      }

    };


    /**
     * Simplified version of http://eriwen.com/javascript/js-stack-trace/
     */
    console.trace = function trace() {
      try {
        i.dont.exist++;
      } catch(e) {
        var stack = e.stack || e.stacktrace;
        stack = stack.split('\n').slice(2).join('\n');
        post(stack);
      }
    };


    /**
     * console.assert(false, "I'm gonna fail")
     * @param {Boolean} is_ok
     * @param {String} message optional
     */
    console.assert = function assert (is_ok, message) {
      if (!is_ok) post( 'ASSERT FAIL: '+ message );
    };


    /**
     * @param {String} name optional
     */
    console.group = console.groupCollapsed = function group (name) {
      post('\n-------------------- '+ name +' --------------------');
    };


    /**
     * Print 3 line breaks
     */
    console.groupEnd = function groupEnd () {
      post('\n\n\n');
    };


    /**
     * @param {String} title optional
     */
    console.count = function count (title) {
      var title = title || '';
      arguments.callee.counters = arguments.callee.counters || {};
      if (arguments.callee.counters[title]) {
        arguments.callee.counters[title]++;
      } else {
        arguments.callee.counters[title] = 1;
      }
      post(title +' '+ arguments.callee.counters[title]);
    };


    /**
     * @param {String} title optional
     */
    console.profile = function profile (title) {
      return 'Not implemented';
    };
    console.profileEnd = function profileEnd () {
      return 'Not implemented';
    };


    /**
     * @param {String} name
     */
    console.time = function time (name) {
      return 'Not implemented';
    };
    /**
     * @param {String} name
     */
    console.timeEnd = function timeEnd (name) {
      return 'Not implemented';
    };


  }
}