# Description and Usage

This is a pretty minimal set of scripts for creating new namespaces and collections in JamDB.

### Getting a token

Creating a new namespace requires a special token that needs to be generated via the `jam` CLI on the JamDB server itself. Running: `jam token system-system-system` will create a jwt (expires in 3 hours) that can be used in the steps below.

Run `cp config/default.yml config/local.yml` to create a local settings file. This gives something like:

```
stage:
  JAM_TOKEN: CHANGEME
  JAM_URL: https://staging-metadata.osf.io
  COLLECTIONS_PATH: ./collections.js

prod:
  JAM_TOKEN: CHANGEME
  JAM_URL: https://metadata.osf.io
  COLLECTIONS_PATH: ./collections.js
```

You'll need to replace the value of `JAM_TOKEN` with the token generated above (for the appropriate environment).

### collections.js

The exports of this module will be module be used to determine which collections will be created under the bootstrapped namespace. This file should be structured like:

```
module.exports = [{
    id: 'experiments',
    // optional: state: 'mongo',
    attrs: {
         // optional: schema: {},
         permissions: {
              '*': READ
         }
    }
}, ...
];
```

Adding the `state` field will allow you to specify which backend JamDB will use for a given collection (_generally this is not needed!_).

Adding the `schema` attribute will allow you to provided a JSON Schema that JamDB will use to validate all new and updated documents.

### Running

First: `npm install`

Open a node.js shell (`node`) run:

```javascript
> var Client = require('./client.js')
undefined
> var client = new Client(<your_environment>);
undefined
> client.bootstrap(<your_namespace>)
```
