var storage = require('./storage.js');
var _eventPrefix = 'CrossDomainStorage';

class Channel {

  constructor(channelName, url) {
    this.name = channelName;
    if (!url) {
      this.setupParentWindow();
    } else {
      this.createIframeWindow(url);
    }
    this.listen();
  }

  setupParentWindow() {
    new Promise((fulfill, reject) => {
      this.targetWindow = window.parent;
      fulfill(this);
    });
  }

  createIframeWindow(url) {
    var _iframe = document.createElement('IFRAME');
    _iframe.name = this.name;
    _iframe.src = url;
    _iframe.width = 0;
    _iframe.height = 0;
    _iframe.style.display = 'none';
    _iframe.style.visibility = 'hidden';

    var _body = document.body;
    var _promise = new Promise((fulfill, reject) => {
      _body.appendChild(_iframe);
      _iframe.addEventListener('load', () => {
        this.targetWindow = _iframe.contentWindow;
        fulfill(this);
      });
    });

    this.ready = _promise;
  }

  listen() {
    window.addEventListener('message', (e) => {
      var _data = e.data;
      var _event = _data.event;
      var _params = {
        event: `${_event}:done`,
        status: 'success'
      }

      switch (_event) {
        case `${_eventPrefix}:get`:
          _params.data = storage.getFromStorage();
          break;
        case `${_eventPrefix}:save`:
          storage.setToStorage(_data.data);
          break;
        case `${_eventPrefix}:remove`:
          storage.removeFromStorage(_data.key);
          break;
      }
      this.targetWindow.postMessage(_params, '*');
    }, false);

    return this;
  }

  get(key) {
    return this.getAll().then((data) => {
      return data[key];
    });
  }

  getAll() {
    return new Promise((fulfill, reject) => {
      window.addEventListener('message', (e) => {
        var _data = e.data;
        var _event = _data.event;
        if (_event !== `${_eventPrefix}:get:done`) return;

        if (_data.status === 'success') {
          fulfill(_data.data);
        }
      });

      this.ready.then((channel) => {
        channel.targetWindow.postMessage({
          event: `${_eventPrefix}:get`
        }, '*');
      });
    });
  }

  save(key, value) {
    var _data = {};
    _data[key] = value;
    return this.saveObject(_data);
  }

  saveObject(data) {
    return new Promise((fulfill, reject) => {
      window.addEventListener('message', (e) => {
        var _data = e.data;
        var _event = _data.event;
        if (_event !== `${_eventPrefix}:save:done`) return;

        if (_data.status === 'success') {
          fulfill();
        }
      });

      this.ready.then((channel) => {
        channel.targetWindow.postMessage({
          event: `${_eventPrefix}:save`,
          data: data
        }, '*');
      });
    });
  }

  delete(key) {
    return new Promise((fulfill, reject) => {
      window.addEventListener('message', (e) => {
        var _data = e.data;
        var _event = _data.event;
        if (_event !== `${_eventPrefix}:remove:done`) return;

        if (_data.status === 'success') {
          fulfill();
        }
      });

      this.ready.then((channel) => {
        channel.targetWindow.postMessage({
          event: `${_eventPrefix}:remove`,
          key: key
        }, '*');
      });
    });
  }

}

module.exports = Channel;
