browsenpm.org
=============

Browse packages, users, code, stats and more the public npm registry in style.

### Installation

Browsenpm.org has several dependencies to run locally for development purposes.

```
sudo apt-get install redis-server couchdb
npm install --reg https://us.registry.nodejitsu.com/ --strict-ssl=false
```

### Status npm-mirrors

The current registry status is provided via [npm-probe]. Several probes are run at
set intervals. The publish probe requires authentication with `npm-probe`. These
credentials can (and are) provided to the configuration of the [npm-probe] instance.

```
username: npm-probe
password: g1efm3D4ta
```

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