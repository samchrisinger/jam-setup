/* jshint node: true */
var Manager = require('./jam').Manager;
var CFG = require('config');

var Client = function(env) {
    if (['local', 'stage', 'prod'].indexOf(env) === -1) {
        throw new Error('Invalid environment specified. Please use \'stage\' or \'prod\'');
    }
    var config = CFG[env];
    var collections = require(config.COLLECTIONS_PATH);

    var self = this;
    self._manager = new Manager(config);

    self.getOrCreateNamespace = function(name, attrs) {
        return self._manager.getOrCreate(name, attrs);
    };

    self.updateNamespace = function(name, attrs) {
        return self.getOrCreateNamespace(name).then(function(ns) {
            return ns.update(attrs);
        });
    };

    self.listNamespaces = function() {
        return self._manager.list();
    };

    self.bootstrap = function(namespace, owner) {
        var attrs = {};
        if (owner) {
            attrs.permissions = {
                'system-system-system': 'ADMIN'
            };
            attrs.permissions[owner] = 'ADMIN';
        }
        this.getOrCreateNamespace(namespace, attrs).then(function(ns) {
            console.log('Bootstrapping ', namespace);
            collections.forEach(function(col) {
                console.log('Bootstrapping collection: ', col.id);
                ns.getOrCreate(namespace + '.' + col.id, col.attrs).then(function(collection) {
                    console.log('Updating collection: ', col.id);
                    collection.update(col.attrs);
                });
            });
        });
    };
};

module.exports = Client;
