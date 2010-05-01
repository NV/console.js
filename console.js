(function(window){

  if (typeof console === 'undefined') {
    /**
     * @see http://getfirebug.com/console.html
     */
    window.console = {};
  }

  console._output = console.log || window.opera && opera.postError || function dump (message) {
    console.history = console.history || [];
    return console.history.push(message);
  };

  /**
   * Limit of objects dimensions
   * console.dimensions_limit = 1
   * console.log({a:{b:1}}) ==> { 'a': {?} }
   * console.dimensions_limit = 2
   * console.log({a:{b:1}}) ==> { 'a': { 'b': 1 } }
   */
  console.dimensions_limit = 3;

  /**
   * source_of({x:2, y:8, z:[4,3]}) ==> '{ x: 2, y: 8, z: [4, 3] }'
   */
  console._source_of = function source_of (anything) {

    /**
     * source_of_one_arg({x:2, y:8}) === "{'x':2, 'y':8}"
     * @param {Object} arg
     * @param {Number} limit dimension of objects
     * @param {Array} stack of parent objects
     * @return {String} string representation of input
     */
    function source_of_one_arg (arg, limit, stack) {
      if (arg === null) {
        return 'null';
      } else if (typeof arg === 'undefined') {
        return 'undefined';
      }
      var result = '';
      if (arg && arg.nodeType == 1) {
        // Is element?
        result = '<'+ arg.tagName;
        for (var i=0, ii=arg.attributes.length; i<ii; i++) {
          if (arg.attributes[i].specified) {
            result +=' '+ arg.attributes[i].name +'="'+ arg.attributes[i].value +'"';
          }
        }
        if (arg.childNodes && arg.childNodes.length === 0) {
          result += '/';
        }
        return result + '>';
      }
      var kind = Object.prototype.toString.call(arg).replace('[object ', '').replace(']','');
      if (kind === 'String') {
        return '"'+ arg +'"';
      } else if (kind === 'Array' || kind === 'HTMLCollection' || kind === 'NodeList') {
        // Is array-like object?
        result = '[';
        var arr_list = [];
        for (var j=0, jj=arg.length; j<jj; j++) {
          arr_list[j] = source_of_one_arg(arg[j], limit, stack);
        }
        return result + arr_list.join(', ') +']';
      } else if (kind === 'RegExp') {
        return "/"+ arg.source +"/";
      } else if (kind === 'Date') {
        return arg;
      } else if (typeof arg === 'object') {
        if (!limit) return '{?}';
        // Check circular references
        for (var si=0; si<stack.length; si++) {
          if (stack[si] === arg) {
            return '#';
          }
        }
        stack.push(arg);
        result = '{';
        var arr_obj = [];
        for (var key in arg) {
          try {
            var value = source_of_one_arg(arg[key], limit-1, stack);
            arr_obj.push( '"'+ key +'": '+ value);
          } catch (e) {}
        }
        return result + arr_obj.join(', ') +'}';
      } else {
        return arg;
      }
    }

    return source_of_one_arg(anything, console.dimensions_limit, []).toString();

  };

  
  var browser_suck_at_logging = /*@cc_on 1 || @*/ window.opera;

  var log_methods = ['log', 'info', 'warn', 'error', 'debug', 'dir', 'dirxml'];

  console._args_separator = '\n';
  console._interpolate = /%[sdifo]/gi;

  for (var i=0; i<log_methods.length; i++) {
    var _log = console[log_methods[i]];
    if (browser_suck_at_logging || !console[log_methods[i]]) {
      console[log_methods[i]] = function logger (first_arg) {
        var args = Array.prototype.slice.call(arguments, 0);
        var result = [];
        if (typeof first_arg === 'string' && console._interpolate.test(first_arg)) {
          args.shift();
          result.push(first_arg.replace(console._interpolate, function(){
            return console._source_of(args.shift());
          }));
        }
        for (var i=0; i<args.length; i++) {
          result.push(console._source_of(args[i]));
        }
        return (_log || console._output)(result.join(console._args_separator));
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
        console._output(stack);
      }
    }
  };


  /**
   * console.assert(false, "I'm gonna fail")
   * @param {Boolean} is_ok
   * @param {String} message optional
   */
  console.assert = console.assert || function assert (is_ok, message) {
    if (!is_ok) console._output( 'ASSERT FAIL: '+ message );
  };


  /**
   * @param {String} name optional
   */
  console.group = console.group || function group (name) {
    console._output('\n-------- '+ name +' --------');
  };

  console.groupCollapsed = console.groupCollapsed || console.group;

  /**
   * Print 3 line breaks
   */
  console.groupEnd = console.groupEnd || function groupEnd () {
    console._output('\n\n\n');
  };


  /**
   * @param {String} title optional
   */
  console.count = console.count || function count (title) {
    title = title || '';
    count.counters = count.counters || {};
    if (count.counters[title]) {
      count.counters[title]++;
    } else {
      count.counters[title] = 1;
    }
    console._output(title +' '+ count.counters[title]);
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

  if (typeof require === 'function' && typeof exports !== 'undefined') {
    exports.console = window.console;
    console._output = require('system').print;
  }

})(this);