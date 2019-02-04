const shell = require("shelljs");

module.exports.getPorts = async () => shell.exec("ss -tlnp");
