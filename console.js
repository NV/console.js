if (typeof console === 'undefined') {
  /**
   * @see http://getfirebug.com/console.html
   */
  window.console = {};
}

(function(){
  
  var post = console.log || window.opera && opera.postError || function dump (message) {
    if (typeof console.history === 'undefined') {
      console.history = [];
    }
    console.history.push(message);
  };

  /**
   * Limit of objects dimensions
   * console.dimensions_limit = 1
   * console.log({a:{b:1}}) ==> { 'a': {?} }
   * console.dimensions_limit = 2
   * console.log({a:{b:1}}) ==> { 'a': { 'b': 1 } }
   */
  console.dimensions_limit = 1;

  /**
   * source_of({x:2, y:8, z:[4,3]}) ==> '{ x: 2, y: 8, z: [4, 3] }'
   */
  function source_of () {

    /**
     * source_of_one_arg({x:2, y:8}) === "{'x':2, 'y':8}"
     * @param {Object} arg
     * @param {Number} limit dimension of objects
     * @return {String} string representation of input
     */
    function source_of_one_arg (arg, limit) {

      if (limit === undefined) {
        var limit = console.dimensions_limit;
      }

      var result = '';

      if (arg === null) {
        return 'null';
      } else if (typeof arg === 'undefined') {
        return 'undefined';
      } else if (arg && arg.nodeType == 1) {
        // Is element?
        result = '<'+ arg.tagName;
        for (var i=0; i<arg.attributes.length; i++) {
          result +=' '+ arg.attributes[i].name +'="'+ arg.attributes[i].value +'"';
        }
        if (arg.childElementCount === 0) {
          result += '/';
        }
        result += '>';
      } else if (Object.prototype.toString.call(arg) === '[object Array]') {
        // Is array?
        result = '[';
        var arr_list = [];
        for (var i=0; i<arg.length; i++) {
          arr_list[i] = source_of_one_arg(arg[i], limit);
        }
        result += arr_list.join(', ') +']';
      } else if (Object.prototype.toString.call(arg) === '[object String]') {
        result = "'"+ arg +"'";
      } else if (arg instanceof RegExp) {
        result = "/"+ arg.source +"/";
      } else if (typeof arg === 'object') {
        if (!limit) return '{?}';
        result = '{ ';
        var arr_obj = [];
        for (var key in arg) {
          arr_obj.push( "'"+ key +"': "+ source_of_one_arg(arg[key], limit-1) );
        }
        result += arr_obj.join(', ') +' }';
      } else {
        return arg;
      }

      return result;
    }

    var result = [];
    for (var i=0; i<arguments.length; i++) {
      result.push( source_of_one_arg(arguments[i]) );
    }
    return result.join(', ');

  }

  
  var browser_suck_at_logging = /*@cc_on 1 || @*/ window.opera;

  var log_methods = ['log', 'info', 'warn', 'error', 'debug', 'dir', 'dirxml'];

  for (var i=0; i<log_methods.length; i++) {
    var _log = console[log_methods[i]];
    if (browser_suck_at_logging || !console[log_methods[i]]) {
      console[log_methods[i]] = function () {
        (_log || post)( source_of.apply(this, arguments) );
      };
    }
  }


  /**
   * Simplified version of http://eriwen.com/javascript/js-stack-trace/
   */
  console.trace = console.trace || function trace() {
    try {
      i.dont.exist++;
    } catch(e) {
      var stack = e.stack || e.stacktrace;
      if (stack) {
        try {
          stack = stack.split('\n').slice(2).join('\n');
        } catch (err) {}
        post(stack);
      }
    }
  };


  /**
   * console.assert(false, "I'm gonna fail")
   * @param {Boolean} is_ok
   * @param {String} message optional
   */
  console.assert = console.assert || function assert (is_ok, message) {
    if (!is_ok) post( 'ASSERT FAIL: '+ message );
  };


  /**
   * @param {String} name optional
   */
  console.group = console.group || function group (name) {
    post('\n-------- '+ name +' --------');
  };

  console.groupCollapsed = console.groupCollapsed || console.group;

  /**
   * Print 3 line breaks
   */
  console.groupEnd = console.groupEnd || function groupEnd () {
    post('\n\n\n');
  };


  /**
   * @param {String} title optional
   */
  console.count = console.count || function count (title) {
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
  console.profile = console.profile || function profile (title) {
    return 'Not implemented';
  };
  console.profileEnd = console.profileEnd || function profileEnd () {
    return 'Not implemented';
  };


  console._timers = {};

  /**
   * @param {String} name such as "my damn slow parser"
   */
  console.time = console.time || function time (name) {
    var start = (new Date).getTime();
    console._timers[name] = {'start': start};
  };

  /**
   * @param {String} name such as "my damn slow parser"
   */
  console.timeEnd = console.timeEnd || function timeEnd (name) {
    var end = (new Date).getTime();
    console.info(name +': '+ (end - console._timers[name].start) +'ms');
    console._timers[name].end = end;
  };

})();