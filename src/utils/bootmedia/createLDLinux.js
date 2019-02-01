const fs = require("fs");

module.exports.createLDLinux = async (ldLinuxPath, ctx) => {
  const ldLinux = fs.createWriteStream(ldLinuxPath);
  const streamLdLinux = await ctx.call("syslinux.create", {
    fragment: "ldlinux.c32"
  });
  streamLdLinux.pipe(ldLinux);
  return ldLinux;
};
