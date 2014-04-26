browsenpm.org
=============

Browse packages, users, code, stats and more the public npm registry in style.

### Installation

Browsenpm.org has several dependencies to run locally for development purposes.

```
sudo apt-get install redis-server couchdb
npm install --reg https://us.registry.nodejitsu.com/ --strict-ssl=false
```

### Database

CouchDB will be used to cache all the data of [npm-probe]. The following views
should be available on the database to ensure the pagelet can fetch the data.
These views need to be added in the `browsenpm` database.

#### _design/results/_view/ping

```js
function(doc) {
  if (doc.name === 'ping') emit([doc.registry, doc.start], doc);
}
```

#### _design/results/_view/delta

```js
function(doc) {
  if (doc.name === 'delta') emit([doc.registry, doc.start], doc);
}
```

#### _design/results/_view/publish

```js
function(doc) {
  if (doc.name === 'publish') emit([doc.registry, doc.start], doc);
}
```

#### _design/results/_list/byRegistry

``` js
function(doc, req) {
  provides('json', function() {
    var result = {};
    while (row = getRow()) {
      var name = row.key[0];
      result[name] = result[name] || [];
      result[name].push(row.value);
    }
    send(JSON.stringify(result));
  });
}
```

#### _design/results

If you don't have any previous design documents you can simply create a new
document in the `browsenpm` database with `_design/results` as `id` use the
following blob as source of the document:

```js
{
  "_id": "_design/results",
  "views": {
    "delta": {
      "map": "function(doc) { if (doc.name === 'delta') emit([doc.registry, doc.start], doc); }"
    },
    "ping": {
      "map": "function(doc) { if (doc.name === 'ping') emit([doc.registry, doc.start], doc);}"
    },
    "publish": {
      "map": "function(doc) { if (doc.name === 'publish') emit([doc.registry, doc.start], doc);}"
    }
  },
  "lists": {
    "byRegistry": "function(doc, req) { provides('json', function() { var result = {}; while (row = getRow()) { var name = row.key[0]; result[name] = result[name] || []; result[name].push(row.value); } send(JSON.stringify(result));   }); }"
  }
}
```

If you do not have these views in place the server will not start and will most
likely die with `[object Object]` in the terminal.

### Status npm-mirrors

The current registry status is provided via [npm-probe]. Several probes are run at
set intervals. The publish probe requires authentication with `npm-probe`. These
credentials can (and are) provided to the configuration of the [npm-probe] instance.

npm-probe is provided with a CouchDB cache instance. All data is stored in the
database `browsenpm`.

[npm-probe]: https://github.com/Moveo/npm-probe

### Cache

During development it might be useful to destroy cached data, simply set any of the
following environment variables to flush cache.

```
CACHE=flush:redis
CACHE=flush:couchdb
```

### Debugging

Most components have debug statements to help debugging, shortlist:

| Module    | Description | Statement               |
| --------- | ----------- | ----------------------- |
| bigpipe   | server      | `DEBUG=bigpipe`         |
| bigpipe   | pages       | `DEBUG=bigpipe:page`    |
| bigpipe   | pagelets    | `DEBUG=bigpipe:pagelet` |
| npm-probe | statistics  | `DEBUG=npm-probe`       |
| dynamis   | cache layer | `DEBUG=dynamis`         |
