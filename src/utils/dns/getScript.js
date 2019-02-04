const shell = require("shelljs");
const fs = require("fs");

module.exports.getScript = async scriptpath =>
  fs.existsSync(scriptpath) ? shell.cat(scriptpath) : false;
