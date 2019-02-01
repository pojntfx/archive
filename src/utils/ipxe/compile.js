const shell = require("shelljs");
const fs = require("fs");

const initialize = (indir, outdir, script) => {
  shell.mkdir("-p", `${indir}/config/`);
  shell.mkdir("-p", outdir);
  fs.writeFileSync(`${indir}/config/preseed.ipxe`, script);
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
  shell.exec(
    `make ${platform}/${driver}.${extension} EMBED=${indir}/config/preseed.ipxe`
  );
  shell.cp(`${indir}/src/${platform}/${driver}.${extension}`, outdir);
  return `${indir}/src/${platform}/${driver}.${extension}`;
};
