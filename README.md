browsenpm.org
=============

Browse packages, users, code, stats and more the public npm registry in style.

### Installation

Browsenpm.org has several dependencies to run locally for development purposes.

```bash
sudo apt-get install redis-server couchdb
npm install
```

After update the configuration in `browsenpm.config.json` and provide the details
needed. Note that your database might require authentication credentials.

### Running

```bash
npm start

# Or run the server by specifying a configuration file.
bin/server -c config.dev.json
```

Providing a custom configuration is optional. By default `browsenpm.config.json`
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

### Debugging

Most components have debug statements to help debugging, shortlist:

| Module    | Description | Statement               |
| --------- | ----------- | ----------------------- |
| bigpipe   | server      | `DEBUG=bigpipe:*`       |
| bigpipe   | pages       | `DEBUG=bigpipe:page`    |
| bigpipe   | pagelets    | `DEBUG=bigpipe:pagelet` |
| npm-probe | statistics  | `DEBUG=npm-probe`       |
| dynamis   | cache layer | `DEBUG=dynamis`         |
