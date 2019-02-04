const shell = require("shelljs");

module.exports.getInterfaces = async () => shell.exec("ip a");
