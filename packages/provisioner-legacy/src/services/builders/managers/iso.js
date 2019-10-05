const { createISO } = require("../../utils/iso/createISO");
const uuidv1 = require("uuid/v1");
const fs = require("fs");
const shell = require("shelljs");

module.exports = {
  name: "iso",
  actions: {
    create: async ctx => {
      const uuid = uuidv1();
      const indir = `/tmp/pojntfx/provisioner/iso/${uuid}/in`;
      const packagedir = `/tmp/pojntfx/provisioner/iso/${uuid}/package`;

      shell.mkdir("-p", indir);
      shell.mkdir("-p", packagedir);

      const content = fs.createWriteStream(`${indir}/content.zip`);
      ctx.params.pipe(content);

      return new Promise(resolve =>
        content.on(
          "close",
          async () =>
            await createISO({
              ...ctx.meta,
              indir,
              packagedir
            }).then(path => resolve(fs.createReadStream(path)))
        )
      );
    }
  }
};
