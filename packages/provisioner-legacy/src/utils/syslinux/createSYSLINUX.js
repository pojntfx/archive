const { init } = require("./init");
const { build } = require("./build");

module.exports.createSYSLINUX = async ({ fragment, builddir }) => {
  await init(builddir);
  await build(builddir);
  return `${builddir}/${fragment}`;
};
