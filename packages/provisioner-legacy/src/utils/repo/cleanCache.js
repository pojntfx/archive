const shell = require("shelljs");

module.exports.cleanCache = async outdir => shell.rm("-rf", `${outdir}/*`);
