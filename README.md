browsenpm.org
=============

Browse packages, users, code, stats and more the public npm registry in style.

**Note: during development, browsenpm will depend on the [pageletify branch of contour]
, manually symlink or install (npm was being an idiot with git again).**

### Installation

Browsenpm.org has several dependencies to run locally for development purposes.

```
sudo apt-get install redis-server couchdb
npm install --reg https://us.registry.nodejitsu.com/ --strict-ssl=false
```

[pageletify branch of contour]: https://github.com/nodejitsu/contour/tree/pageletify


### Cache

During development it might be useful to destroy the caching data, simply set the
following environment variable to destroy either of the caches.

```
CACHE=destroy:redis
CACHE=destroy:couchdb
```