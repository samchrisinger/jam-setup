/* jshint node: true, esnext: true */

var CREATE = 'CREATE';
var UPDATE = 'UPDATE';
var READ = 'READ';

module.exports = [{
    id: 'experiments',
    attrs: {
        // schema: {},
        permissions: {
            '*': READ
        }
    }
}, {
    id: 'accounts',
    attrs: {
        // schema: {},
        permissions: {
            '*': CREATE
        }
    }
}, {
    id: 'thumbnails',
    state: 'mongo',
    attrs: {
        permissions: {
            '*': READ
        }
    }
}];
