const { init } = require("./init");
const { clone } = require("./clone");
const { build } = require("./build");
const { packageIMG } = require("./packageIMG");
const { packageFolder } = require("./packageFolder");

module.exports.createGRUB = async ({
  indir,
  buildir,
  packagedir,
  platform,
  architecture,
  extension,
  label,
  fragment
}) => {
  await init(indir, buildir, packagedir);
  await clone(indir);
  await build(indir, buildir, platform, architecture, extension, label);
  if (fragment === "img") {
    return await packageIMG(label, buildir, packagedir);
  } else {
    return await packageFolder(buildir, packagedir);
  }
};
