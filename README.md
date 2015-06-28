# CrossDomainStorage
A cross domain storage solution with an API to store data through iframe.  Use local storage on all the browsers except Safari.  Use cookies on Safari because of the default option of 'From third parties and advertisers.'

## Basic Usage

First of all, create a channel with a url to save data.

```
CrossDomainStorage
.newChannel('storage', 'http://localhost:8001/storage.html')
.save('sampleKey', 'sampleData');
```

For the url you specify above, create a channel to receive the data.

```
CrossDomainStorage
.newChannle('parent');
```

## API

### ``CrossDomainStorage.newChannel(channelName, [url])``

Create a channel with a name.

If a url is passed, it creates a channel connecting to the url you specify through iframe.

If a url is not passed, it creates a channel that connecting to the parent window.  

### ``CrossDomainStorage.getChannel(channelName)``

Return the channel that a name matches.

### ``Channel.prototype.get(key)``

Return a promise that returns the value of a key.

### ``Channel.prototype.getAll()``

Return a promise that returns all the data stored by CrossDomainStorage.

### ``Channel.prototype.save(key, value)``

Set a value to a key and return a promise after it finishes setting.

### ``Channel.prototype.delete(key)``

Delete data that a key matches and return a promise after it finishes deleting.