const shell = require("shelljs");
const fs = require("../../bindings/asyncFs");
const { AutoTools } = require("../../bindings/autotools");

const initialize = async (indir, outdir, script) => {
  shell.mkdir("-p", `${indir}/config/`);
  shell.mkdir("-p", outdir);
  await fs.writeFile(`${indir}/config/preseed.ipxe`, script);
  shell.cd(`${indir}/src/`);
};

module.exports.compile = async (
  indir,
  outdir,
  script,
  platform,
  driver,
  extension
) => {
  await initialize(indir, outdir, script);
  await AutoTools.make(
    `${platform}/${driver}.${extension}`,
    `EMBED=${indir}/config/preseed.ipxe NO_WERROR=1`
  );
  shell.cp(`${indir}/src/${platform}/${driver}.${extension}`, outdir);
  return `${indir}/src/${platform}/${driver}.${extension}`;
};
