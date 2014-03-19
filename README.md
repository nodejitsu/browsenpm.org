browsenpm.org
=============

Browse packages, users, code, stats and more the public npm registry in style.

**Note: during development, browsenpm will depend on the [pageletify branch of contour]
and the [cache branch of nodejitsu-app], manually symlink or install these branches
(npm was being an idiot with git again).**

### Installation

Browsenpm.org has several dependencies to run locally for development purposes.

```
sudo apt-get install redis-server couchdb
npm install --reg https://us.registry.nodejitsu.com/ --strict-ssl=false
```

[pageletify branch of contour]: https://github.com/nodejitsu/contour/tree/pageletify
[cache branch of nodejitsu-app]: https://github.com/nodejitsu/nodejitsu-app/tree/cache