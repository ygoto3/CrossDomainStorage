!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),(n.index||(n.index={})).js=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var storage = _dereq_('./storage.js');
var _eventPrefix = 'CrossDomainStorage';

var Channel = (function () {
  function Channel(channelName, url) {
    _classCallCheck(this, Channel);

    this.name = channelName;
    if (!url) {
      this.setupParentWindow();
    } else {
      this.createIframeWindow(url);
    }
    this.listen();
  }

  _createClass(Channel, [{
    key: 'setupParentWindow',
    value: function setupParentWindow() {
      var _this = this;

      new Promise(function (fulfill, reject) {
        _this.targetWindow = window.parent;
        fulfill(_this);
      });
    }
  }, {
    key: 'createIframeWindow',
    value: function createIframeWindow(url) {
      var _this2 = this;

      var _iframe = document.createElement('IFRAME');
      _iframe.name = this.name;
      _iframe.src = url;
      _iframe.width = 0;
      _iframe.height = 0;
      _iframe.style.display = 'none';
      _iframe.style.visibility = 'hidden';

      var _body = document.body;
      var _promise = new Promise(function (fulfill, reject) {
        _body.appendChild(_iframe);
        _iframe.addEventListener('load', function () {
          _this2.targetWindow = _iframe.contentWindow;
          fulfill(_this2);
        });
      });

      this.ready = _promise;
    }
  }, {
    key: 'listen',
    value: function listen() {
      var _this3 = this;

      window.addEventListener('message', function (e) {
        var _data = e.data;
        var _event = _data.event;
        var _params = {
          event: _event + ':done',
          status: 'success'
        };

        switch (_event) {
          case _eventPrefix + ':get':
            _params.data = storage.getFromStorage();
            break;
          case _eventPrefix + ':save':
            storage.setToStorage(_data.data);
            break;
          case _eventPrefix + ':remove':
            storage.removeFromStorage(_data.key);
            break;
        }
        _this3.targetWindow.postMessage(_params, '*');
      }, false);

      return this;
    }
  }, {
    key: 'get',
    value: function get(key) {
      return this.getAll().then(function (data) {
        return data[key];
      });
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      var _this4 = this;

      return new Promise(function (fulfill, reject) {
        window.addEventListener('message', function (e) {
          var _data = e.data;
          var _event = _data.event;
          if (_event !== _eventPrefix + ':get:done') return;

          if (_data.status === 'success') {
            fulfill(_data.data);
          }
        });

        _this4.ready.then(function (channel) {
          channel.targetWindow.postMessage({
            event: _eventPrefix + ':get'
          }, '*');
        });
      });
    }
  }, {
    key: 'save',
    value: function save(key, value) {
      var _data = {};
      _data[key] = value;
      return this.saveObject(_data);
    }
  }, {
    key: 'saveObject',
    value: function saveObject(data) {
      var _this5 = this;

      return new Promise(function (fulfill, reject) {
        window.addEventListener('message', function (e) {
          var _data = e.data;
          var _event = _data.event;
          if (_event !== _eventPrefix + ':save:done') return;

          if (_data.status === 'success') {
            fulfill();
          }
        });

        _this5.ready.then(function (channel) {
          channel.targetWindow.postMessage({
            event: _eventPrefix + ':save',
            data: data
          }, '*');
        });
      });
    }
  }, {
    key: 'delete',
    value: function _delete(key) {
      var _this6 = this;

      return new Promise(function (fulfill, reject) {
        window.addEventListener('message', function (e) {
          var _data = e.data;
          var _event = _data.event;
          if (_event !== _eventPrefix + ':remove:done') return;

          if (_data.status === 'success') {
            fulfill();
          }
        });

        _this6.ready.then(function (channel) {
          channel.targetWindow.postMessage({
            event: _eventPrefix + ':remove',
            key: key
          }, '*');
        });
      });
    }
  }]);

  return Channel;
})();

module.exports = Channel;

},{"./storage.js":3}],2:[function(_dereq_,module,exports){
'use strict';

var Channel = _dereq_('./Channel.js');

var CrossDomainStorage = {

  channels: {},

  newChannel: function newChannel(channelName, url) {
    var _channel = new Channel(channelName, url);
    this.channels[channelName] = _channel;
    return _channel;
  },

  getChannel: function getChannel(channelName) {
    return this.channels[channelName];
  }

};

module.exports = CrossDomainStorage;

},{"./Channel.js":1}],3:[function(_dereq_,module,exports){
'use strict';

var _safari = typeof window.chrome == 'undefined' && 'WebkitAppearance' in document.documentElement.style;
var _appKey = 'CrossDomainStorage';
var _infiniteDate = 'Fri, 31 Dec 9999 23:59:59 GMT';

module.exports = {

  getFromStorage: function getFromStorage() {
    var _itemStr;
    if (!_safari) {
      _itemStr = window.localStorage.getItem(_appKey);
    } else {
      _itemStr = decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(_appKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
    }

    if (!_itemStr) return;

    return JSON.parse(_itemStr);
  },

  setToStorage: function setToStorage(data) {
    var _item = this.getFromStorage(_appKey);
    if (!_item) _item = {};

    for (var _key in data) {
      _item[_key] = data[_key];
    }

    if (!_safari) {
      window.localStorage.setItem(_appKey, JSON.stringify(_item));
    } else {
      window.document.cookie = _appKey + '=' + JSON.stringify(_item);
    }
  },

  removeFromStorage: function removeFromStorage(key) {
    var _item = this.getFromStorage(_appKey);
    if (!_item || !_item[key]) return;

    delete _item[key];

    var _stringifiedData = JSON.stringify(_item);
    if (_stringifiedData === '{}') {
      if (!_safari) {
        window.localStorage.removeItem(_appKey);
      } else {
        window.document.cookie = _appKey + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      }
    } else {
      if (!_safari) {
        window.localStorage.setItem(_appKey, _stringifiedData);
      } else {
        window.document.cookie = _appKey + '=' + _stringifiedData + '; expires=' + _infiniteDate;
      }
    }
  }

};

},{}]},{},[2])
(2)
});