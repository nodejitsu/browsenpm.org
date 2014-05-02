browsenpm.org
=============

Browse packages, users, code, stats and more the public npm registry in style.

### Installation

Browsenpm.org has several dependencies to run locally for development purposes.

```bash
sudo apt-get install redis-server couchdb
npm install
```

After update the configuration in `development.json` and provide the details
needed. Note that your database might require authentication credentials.

### Running

```bash
npm start

# Or run the server by specifying a configuration file.
bin/server -c config.dev.json
```

Providing a custom configuration is optional. By default `development.json`
will be used.

### Database

Both Redis and CouchDB should be running to cache data for certain pagelets. Make
sure you run them locally or provide a server that runs either.

CouchDB will be used to cache all the data of [npm-probe]. The views in
`plugins/couchdb.json` should be available on the database to ensure the
pagelet can fetch the data. These views will be added to the `browsenpm` database
on startup.

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

```bash
CACHE=flush:redis
CACHE=flush:couchdb
```

**Warming up**

Getting data for a package page can consume a lot of resources. A small cli-tool is
available to warm up the cache. This will consume github tokens like crazy so please
use with caution. By default 10000 packages are resolved, use `LIMIT=n` where n is
an integer.

```
npm run-script preheat
```

Note: supplying `FETCH=true` will download the latest available package list and sort
all packages by github stars. This is not required by default and should only be
done if the package list is severly outdated. This will use about 10 github token
keys and run for about 2 hours. Make sure enough tokens are available.

### Debugging

Most components have debug statements to help debugging, shortlist:

| Module    | Description    | Statement                            |
| --------- | -------------- | ------------------------------------ |
| bigpipe   | all components | `DEBUG=bigpipe:*`                    |
| bigpipe   | server         | `DEBUG=bigpipe:server`               |
| bigpipe   | pages          | `DEBUG=bigpipe:page`                 |
| bigpipe   | pagelets       | `DEBUG=bigpipe:pagelet`              |
| npm-probe | statistics     | `DEBUG=npm-probe`                    |
| dynamis   | cache layer    | `DEBUG=dynamis`                      |
| ALL       | every module   | `DEBUG=bigpipe:*,dynamis,npm-probe`  |