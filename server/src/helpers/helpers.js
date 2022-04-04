const _ = require("underscore");

function setDefaults(options, defaults) {
    return _.defaults({}, _.clone(options), defaults);
}

module.exports = {
    setDefaults,
};
