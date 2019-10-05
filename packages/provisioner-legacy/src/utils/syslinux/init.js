const shell = require("shelljs");

module.exports.init = async buildir => {
  shell.mkdir("-p", buildir);
};
