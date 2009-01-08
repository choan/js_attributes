/*  Attributes, version 0.0.1
 *  (c) 2009 Choan Galvez
 *
 *  Attributes is freely distributable under
 *  the terms of an MIT-style license.
 *  For details, see the web site: http://github.com/choan/js_attributes
 *--------------------------------------------------------------------------*/

var Attributes;

(function() {

  var _data = {};
  var _attrs = {};
  var _uid = 0;
  var _expando = '_config' + (new Date()).getTime();

  Attributes = function() {
    this[_expando] = ++_uid;
    _attrs[_uid] = {};
    _data[_uid] = {};
  };

  Attributes.on = function(client, hash) {
    var server = new Attributes();
    client[_expando] = server[_expando];
    var methods = 'get,getAttribute,set,setAttribute,each,eachAttribute,add,addAttribute,merge,mergeAttributes'.split(',');
    var name, method;
    for (var i = 0; i < methods.length; i += 2) {
      client[methods[i + 1]] = function(s, m) {
        return function() {
          var ret = s[m].apply(s, arguments);
          if (ret == server) return this;
          return ret;
        };
      }(server, methods[i]);
    }
    if (hash) {
      for (var p in hash) {
        if (hash.hasOwnProperty(p)) {
          server.add(p).set(p, hash[p]);
        }
      }
    }
    return client;
  };

  Attributes.validations = {
    numeric : function(value) {
      if (typeof value !== 'number') return false;
    },
    min : function(value, min) {
      if (value < min) return false;
    },
    max : function(value, max) {
      if (value > max) return false;
    }
  };

  Attributes.prototype = {
    add : function(name, validations, onchange) {
      _attrs[this[_expando]][name] = {
        validations: validations || [],
        onchange: onchange || null
      };
      return this;
    },
    merge : function(other) {
      for (var p in other)
        if (other.hasOwnProperty(p))
          this.set(p, other[p]);
      return this;
    },
    set : function(name, value) {
      // is the attribute allowed?
      var attrs = _attrs[this[_expando]];
      if (!(name in attrs)) {
        throw { name: 'InvalidAttribute', message: "'" + name + "' attribute is undeclared" };
        return false;
      }
      // is the value acceptable?
      var validations = attrs[name].validations;
      for (var i = 0; i < validations.length; i += 1) {
        if (false === Attributes.validations[validations[i][0]].apply(this, [value].concat(validations[i].slice(1)))) {
          throw { name: 'InvalidAttributeValue', message: "'" + name + "' attribute does not accept the given value" };
          return false;
        }
      }

      // fire the callback if set and the new value is different
      // from the previous one
      var onchange = attrs[name].onchange;
      var data = _data[this[_expando]];
      if (data[name] !== value) {
        if (!onchange || false !== onchange(name, value, data[name])) {
          data[name] = value;
          return true;
        }
        else {
          return false;
        };
      }
      return true;
    },
    get : function(name, def) {
      var data = _data[this[_expando]];
      if (name in data) return data[name];
      return def;
    },
    each : function(fn) {
      var attrs = _attrs[this[_expando]];
      var data  = _data[this[_expando]];
      for (var k in attrs) {
        fn(data[k], k);
      }
      return this;
    }

  };

})();