var _safari = typeof window.chrome == 'undefined' && 'WebkitAppearance' in document.documentElement.style;
var _appKey = 'CrossDomainStorage';
var _infiniteDate = 'Fri, 31 Dec 9999 23:59:59 GMT';

module.exports = {

  getFromStorage: function () {
    var _itemStr;
    if (!_safari) {
      _itemStr = window.localStorage.getItem(_appKey);
    } else {
      _itemStr = decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(_appKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    }

    if (!_itemStr) return;

    return JSON.parse(_itemStr);
  },

  setToStorage: function (data) {
    var _item = this.getFromStorage(_appKey);
    if (!_item) _item = {};

    for (var _key in data) {
      _item[_key] = data[_key];
    }

    if (!_safari) {
      window.localStorage.setItem(_appKey, JSON.stringify(_item));
    } else {
      window.document.cookie = `${_appKey}=${JSON.stringify(_item)}`
    }
  },

  removeFromStorage: function (key) {
    var _item = this.getFromStorage(_appKey);
    if (!_item || !_item[key]) return;

    delete _item[key];

    var _stringifiedData = JSON.stringify(_item);
    if (_stringifiedData === '{}') {
      if (!_safari) {
        window.localStorage.removeItem(_appKey);
      } else {
        window.document.cookie = `${_appKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`
      }
    } else {
      if (!_safari) {
        window.localStorage.setItem(_appKey, _stringifiedData);
      } else {
        window.document.cookie = `${_appKey}=${_stringifiedData}; expires=${_infiniteDate}`
      }
    }
  }

};
