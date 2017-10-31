var cls = require('continuation-local-storage');
var crypto = require('crypto');
var namespace = {}
var nsString = "";
var ns;

namespace.createNamespace = function() {
    nsString = "global-name-space-" + crypto.randomBytes(50).toString('hex');
    ns = cls.createNamespace(nsString);
    return ns;
}

namespace.getNSString = function() {
    return nsString;
}

namespace.getNS = function() {
    return ns;
}

namespace.get = function(key) {
    return ns.get(key);
}

namespace.set = function(key, value) {
    ns.set(key, value);
}

module.exports = namespace;