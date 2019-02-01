const uuidv1 = require("uuid/v1");
const { initialize } = require("./initialize");
const { clone } = require("./clone");
const { compile } = require("./compile");

module.exports.createIPXE = async ({
  tempdir,
  script,
  platform,
  driver,
  extension
}) => {
  const indir = `${tempdir}/in/ipxe`;
  const outdir = `${tempdir}/out`;

  await initialize({ indir, outdir });
  await clone(indir);
  return await compile(indir, outdir, script, platform, driver, extension);
};
