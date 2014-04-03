browsenpm.org
=============

Browse packages, users, code, stats and more the public npm registry in style.

### Installation

Browsenpm.org has several dependencies to run locally for development purposes.

```
sudo apt-get install redis-server couchdb
npm install --reg https://us.registry.nodejitsu.com/ --strict-ssl=false
```

### Cache

During development it might be useful to destroy cached data, simply set any of the
following environment variables to flush cache.

```
CACHE=flush:redis
CACHE=flush:couchdb
```