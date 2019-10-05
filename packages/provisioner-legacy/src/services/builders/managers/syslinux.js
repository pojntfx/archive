const { createSYSLINUX } = require("../../utils/syslinux/createSYSLINUX");
const uuidv1 = require("uuid/v1");
const fs = require("fs");

module.exports = {
  name: "syslinux",
  actions: {
    create: {
      params: {
        fragment: "string"
      },
      handler: async ctx => {
        const uuid = uuidv1();
        return fs.createReadStream(
          await createSYSLINUX({
            ...ctx.params,
            builddir: `/tmp/pojntfx/provisioner/syslinux/${uuid}/build`
          })
        );
      }
    }
  }
};
