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

  var link = function(rel, params) {

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

    return ll;
  };

  var uri = function(rel, params) {

    return (this.link(rel, params) || {}).uri;
  };

  var extractArgs = function(as) {

    var a = []; for (var i = 0, l = as.length; i < l; i++) { a.push(as[i]) };

    var n = null;
    var o = {};
    o.rel = a.shift();
    o.params = (typeof a[0]) === 'function' ? {} : a.shift();
    o.data = (typeof a[0]) === 'function' ? {} : a.shift();
    o.onSuccess = a.shift();
    o.onError = a.shift();

    return o;
  }

  var get = function(rel, params, onSuccess, onError) {

    var a = extractArgs(arguments);

    Half.request(
      this.link(a.rel, a.params), 'GET', null, a.onSuccess, a.onError);
  };

  var post = function(rel, params, data, onSuccess, onError) {

    var a = extractArgs(arguments);

    Half.request(
      this.link(a.rel, a.params), 'POST', a.data, a.onSuccess, a.onError);
  };

  this.wrap = function(doc) {

    doc.link = link;
    doc.uri = uri;
    doc.get = get;
    doc.post = post;

    return doc;
  };

  this.go = function(uri, onSuccess, onError) {

    // warning: the synchronous mode locks the whole "page"

    var async = true;
    var d = undefined;

    if (onSuccess === undefined) {
      async = false;
      onSuccess = function(doc) { d = doc; };
      onError = function() {};
    }

    Half.request({ uri: uri }, 'GET', null, onSuccess, onError, async);

    return d;
  }

  this.request = function(link, meth, data, onSuccess, onError, async) {

    if (async === undefined) async = true;

    var os = function(json) {
      onSuccess(Half.wrap(json));
    };
    var oe = function(jqxhr, status, err) {
      if ( ! onError) return;
      var d = null;
      try { d = JSON.parse(jqxhr.responseText); } catch(ex) {}
      onError(d, jqxhr, status, err);
    };

    var params =
      { type: meth, url: link.uri, async: async, success: os, error: oe };

    if (data) {
      params.contentType = 'application/json; charset=utf-8' // json+hal ?
      params.data = JSON.stringify(data);
    }

    $.ajax(params);
  };

  return this;

}).apply({});

