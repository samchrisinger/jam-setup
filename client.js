/* jshint node: true */
var Manager = require('./jam').Manager;
var CFG = require('config');

var Client = function(env) {
    if (['stage', 'prod'].indexOf(env) === -1) {
        throw new Error('Invalid environment specified. Please use \'stage\' or \'prod\'');
    }
    var config = CFG[env];
    var collections = require(config.COLLECTIONS_PATH);

    var self = this;
    self._manager = new Manager(config.JAM_TOKEN);

    self.getOrCreateNamespace = function(name) {
        return self._manager.getOrCreate(name);
    };

    self.updateNamespace = function(name, attrs) {
        return self.getOrCreateNamespace(name).then(function(ns) {
            return ns.update(attrs);
        });
    };

    self.listNamespaces = function() {
        return self._manager.list();
    };

    self.bootstrap = function(namespace) {
        this.getOrCreateNamespace(namespace).then(function(ns) {
            console.log('Bootstrapping ', namespace);
            collections.forEach(function(col) {
                console.log('Bootstrapping collection: ', col.id);
                var attrs = null;
                if (col.state) {
                    attrs = {
                        state: col.state
                    };
                }
                ns.getOrCreate(col.id, col.attrs.state).then(function(collection) {
                    console.log('Updating collection: ', col.id);
                    collection.update(col.attrs);
                });
            });
        });
    };
};

module.exports = Client;
