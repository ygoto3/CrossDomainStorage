var CDS = require('../../dist/CrossDomainStorage.js');

CDS.newChannel('storage', 'http://localhost:8001/storage.html');

var update = () => {
  CDS.getChannel('storage')
  .getAll()
  .then((data) => {
    document.getElementById('stored_data').innerHTML = JSON.stringify(data);
  });
};

var addSubmitEl = document.getElementById('add_submit');
addSubmitEl.addEventListener('click', (e) => {
  e.preventDefault();

  var _key = document.getElementById('add_key').value;
  var _value = document.getElementById('add_value').value;

  if (!_key || !_value) return;

  CDS.getChannel('storage')
  .save(_key, _value)
  .then(() => update());
}, false);

var removeSubmitEl = document.getElementById('remove_submit');
removeSubmitEl.addEventListener('click', (e) => {
  e.preventDefault();

  var _key = document.getElementById('remove_key').value;

  if (!_key) return;

  CDS.getChannel('storage')
  .delete(_key)
  .then(() => update());
}, false);

var getSubmitEl = document.getElementById('get_submit');
getSubmitEl.addEventListener('click', (e) => {
  e.preventDefault();

  var _key = document.getElementById('get_key').value;

  if (!_key) return;

  CDS.getChannel('storage').get(_key)
  .then((value) => {
    document.getElementById('get_value').innerHTML = value;
  });
}, false);

update();
