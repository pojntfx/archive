const { createGRUB } = require("../utils/grub/createGRUB");
const uuidv1 = require("uuid/v1");
const fs = require("fs");

module.exports = {
  name: "grub",
  actions: {
    create: {
      params: {
        platform: "string",
        architecture: "string",
        extension: "string",
        label: "string",
        fragment: "string"
      },
      handler: async ctx => {
        const uuid = uuidv1();
        return fs.createReadStream(
          await createGRUB({
            ...ctx.params,
            indir: `/tmp/pojntfx/os/grub/in`,
            buildir: `/tmp/pojntfx/os/grub/build`,
            packagedir: `/tmp/pojntfx/os/grub/${uuid}/package`
          })
        );
      }
    }
  }
};
