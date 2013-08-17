/*
 * Copyright (c) 2013-2013, John Mettraux, jmettraux@gmail.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Made in Japan.
 */


var Half = (function() {

  var VERSION = '0.9.0';

  var self = this;

  //
  // the halfDoc prototype and the HalfDoc constructor

  // the prototype for half docs
  //
  var halfDoc = {};

  // the constructor for half docs
  //
  var HalfDoc = function() {};
  HalfDoc.prototype = halfDoc;

  //
  // half doc methods

  halfDoc.link = function(rel, params) {

    if (this._links === undefined) return undefined;

    var l = this._links[rel];

    if (rel.match(/^#/)) {
      for (var r in this._links) {
        if (r.indexOf(rel, r.length - rel.length) < 0) continue;
        l = this._links[r];
        break;
      }
    }

    if ( ! l) return undefined;

    var ll = {}; for (var k in l) ll[k] = l[k];
    ll.uri = ll.href;

    if (ll.templated) {
      for (var k in params) ll.uri = ll.uri.replace('{' + k + '}', params[k]);
    }

    // TODO: throw error on remaining "{" ?

    return ll;
  };

  halfDoc.uri = function(rel, params) {

    return (this.link(rel, params) || {}).uri;
  };

  halfDoc.get = function(rel, params, onSuccess, onError) {

    var a = extractArgs('GET', arguments);

    request(
      this.link(a.rel, a.params), 'GET', null, a.onSuccess, a.onError);
  };

  halfDoc.post = function(rel, params, data, onSuccess, onError) {

    var a = extractArgs('POST', arguments);

    request(
      this.link(a.rel, a.params), 'POST', a.data, a.onSuccess, a.onError);
  };

  halfDoc.embeds = function(embeddedKey) {

    var v = (this._embedded || {})[embeddedKey];

    if ( ! v) return undefined;

    var a = [];
    for (var i = 0, l = v.length; i < l; i++) { a.push(Half.wrap(v[i])); }

    return a;
  };

  //
  // Half functions

  // Returns a new doc which is a shallow copy of the original but with a
  // halfDoc prototype.
  //
  this.wrap = function(doc) {

    var hd = new HalfDoc();
    //for (var p in doc) { if (doc.hasOwnProperty(p)) hd[p] = doc[p]; }
    for (var p in doc) { hd[p] = doc[p]; } // sufficient for plain JSON docs

    return hd;
  };

  this.expand = function(path, href) {

    if (path.match(/^https?:\/\//)) return path;

    if (href === undefined) href = window.location.href;

    if (href.match(/^file:/)) return 'http://localhost:4567/' + path;
      // for testing

    path = path.split('/');

    var m = href.match(/^(https?:\/\/[^\/]+)([^\?]*)/)
    var hbase = m[1];
    var hpath = m[2].split('/'); hpath.pop();

    if (path[0] === '') { hpath = []; }
    else { while(path[0] === '..') { hpath.pop(); path.shift(); } }

    return hbase + hpath.concat(path).join('/');
  }

  this.go = function(uriOrPath, onSuccess, onError) {

    // warning: the synchronous mode locks the whole "page"

    var async = true;
    var d = undefined;

    if (onSuccess === undefined) {
      async = false;
      onSuccess = function(doc) { d = doc; };
      onError = function() {};
    }

    var link = { uri: self.expand(uriOrPath) };

    request(link, 'GET', null, onSuccess, onError, async);

    return d;
  }

  //
  // backstage functions

  var extractArgs = function(meth, as) {

    var o = {};

    for (var i = 0, l = as.length; i < l; i++) {

      var mismatch = false;
      var t = (typeof as[i]);

      if (t === 'string') {
        if (o.rel) mismatch = true;
        o.rel = as[i];
      }
      else if (t === 'object') {
        if (o.data) mismatch = true;
        if ( ! o.params) o.params = as[i]; else o.data = as[i];
      }
      else if (t === 'function') {
        if (o.onError) mismatch = true;
        if (o.onSuccess) o.onError = as[i]; else o.onSuccess = as[i];
      }
      else if (t === 'boolean') {
        if (o.async) mismatch = true;
        o.async = as[i];
      }
      if (mismatch) throw new Error("args mismatch (at '" + as[i] + "')");
    }

    if (meth === 'POST' && o.params && ! o.data) {
      o.data = o.params;
      o.params = null;
    }
    if (meth === 'POST' && ! o.data) {
      throw new Error("missing POST data arg");
    }

    return o;
  }

  var enforceFields = function(link, data) {

    if ( ! link.fields) return data;

    for (var i = 0, l = link.fields.length; i < l; i++) {

      var f = link.fields[i];
      var v = data[f.name];
      var n = v === undefined || v === null;

      if (f.required && n) throw new Error("field '" + f.name + "' required");

      if (n && f['default']) data[f.name] = f['default'];
      if (f.value) data[f.name] = f.value;
    }

    return data;
  };

  var request = function(link, meth, data, onSuccess, onError, async) {

    if (async === undefined) async = true;

    var os = function(json) {

      onSuccess(Half.wrap(json));
    };

    var oe = function(jqxhr, status, err) {

      if ( ! onError) return;

      var t = jqxhr.responseText;
      var d = undefined; try { d = JSON.parse(t); } catch(ex) {}

      var e = { text: t, data: d, jqxhr: jqxhr, status: status, err: err };

      onError(e);
    };

    var params =
      { type: meth, url: link.uri, async: async, success: os, error: oe };

    if (data) {

      params.contentType = 'application/json; charset=utf-8' // json+hal ?

      data = enforceFields(link, data);

      params.data = JSON.stringify(data);
    }

    $.ajax(params);
  };

  //
  // over.

  return this;

}).apply({});

