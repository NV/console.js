if (typeof console === 'undefined') {

  /**
   * @see http://getfirebug.com/console.html
   */
  window.console = {};

  var post = window.opera && opera.postError || alert;

  /**
   * Limit of objects dimensions
   * console.dimensions_limit = 0
   * console.log([42]) ==> [?]
   * console.dimensions_limit = 1
   * console.log([42]) ==> [42]
   */
  console.dimensions_limit = 1;

  /**
   * console.log({x:2, y:8, z:[4,3]}) ==> '{ x: 2, y: 8, z: [4, 3] }'
   * @param Objects
   */
  console.log = console.info = console.warn = console.error = console.debug = console.dir = function log () {

    /**
     * source_of({x:2, y:8}) === "{'x':2, 'y':8}"
     * @param {Object} arg
     * @param {Number} limit dimension of objects
     * @return {String} string representation of input
     */
    var source_of = function source_of (arg, limit) {

      if (typeof limit == 'undefined') {
        var limit = console.dimensions_limit;
      }

      var result = '';

      // Is array?
      if (arg && typeof arg.length === 'number' && typeof arg.splice === 'function') {
        if (!limit) return '[?]';
        result += '[';
        var arr_list = [];
        for (var j = 0; j < arg.length; j++) {
          arr_list.push( source_of(arg[j], limit-1) );
        }
        result += arr_list.join(', ') +']';
      } else if (typeof arg == 'object') {
        if (!limit) return '{?}';
        result += '{ ';
        var arr_obj = [];
        for (var key in arg) {
          arr_obj.push( "'"+ key +"': "+ source_of(arg[key], limit-1) );
        }
        result += arr_obj.join(', ') +' }';
      } else if (typeof arg == 'string') {
        return "'"+ arg +"'";
      } else {
        return arg;
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