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

  var self = this;

  this._mockedHttps = null;

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
    if ( ! l.templated) return l.href;

    var h = l.href;
    for (var k in params) { h = h.replace('{' + k + '}', params[k]); }

    return h;
  };

  var get = function(rel, params, onSuccess, onError) {

    //if (onError === undefined) {
    //  onError = onSuccess; onSuccess = params; params = {};
    //}

    Half.request(this.link(rel, params), 'GET', null, onSuccess, onError);
  };

  var post = function(rel, params, data, onSuccess, onError) {

    //if (onError === undefined) {
    //  onError = onSuccess; onSuccess = data; data = params; params = {};
    //}

    Half.request(this.link(rel, params), 'POST', data, onSuccess, onError);
  };

  this.wrap = function(doc) {

    doc.link = link;
    doc.get = get;
    doc.post = post;

    return doc;
  };

  this.request = function(uri, meth, data, onSuccess, onError) {

    if (self._mockedHttps) return self._mockedHttps.push([ uri, meth, data ]);

    var async = true

    var os = function(json) {
      onSuccess(wrap(json));
    };
    var oe = function(jqxhr, status, err) {
      if ( ! onError) return;
      var d = null;
      try { d = JSON.parse(jqxhr.responseText); } catch(ex) {}
      onError(d, jqxhr, status, err);
    };

    $.ajax({ type: meth, url: uri, async: async, success: os, error: oe });
  };

  return this;

}).apply({});

