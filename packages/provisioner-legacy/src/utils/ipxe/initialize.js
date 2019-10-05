const shell = require("shelljs");

module.exports.initialize = async ({ indir, outdir, distdir }) => {
  indir && shell.mkdir("-p", indir);
  outdir && shell.mkdir("-p", outdir);
  return {
    indir,
    outdir
  };
};
