const shell = require("shelljs");

module.exports.getLogs = async logpath => shell.cat(logpath);
