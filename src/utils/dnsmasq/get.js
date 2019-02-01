const shell = require("shelljs");

module.exports.get = async scriptDir => shell.cat(`${scriptDir}/script.ipxe`);
