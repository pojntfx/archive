const fs = require("fs");
const { createISO } = require("../../utils/bootmedia/createISO");
const uuid1 = require("uuid/v1");
const shell = require("shelljs");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
  name: "bootmedia",
  actions: {
    create: {
      params: {
        script: "string",
        label: "string",
        efiLabel: "string"
      },
      handler: ctx => {
        const id = `${ctx.params.label.split(" ").join("-")}-${uuid1()}`;
        createISO({
          ...ctx.params,
          packageDir: `/tmp/pojntfx/os/bootmedia/${id}/package`,
          id,
          ctx
        });
        return { id };
      }
    },
    get: {
      params: {
        id: "string"
      },
      handler: ctx =>
        shell
          .ls("/tmp/pojntfx/os/bootmedia")
          .filter(folder => folder === ctx.params.id).length > 0
          ? fs.existsSync(
              `/tmp/pojntfx/os/bootmedia/${ctx.params.id}/package/out.iso`
            )
            ? fs.createReadStream(
                `/tmp/pojntfx/os/bootmedia/${ctx.params.id}/package/out.iso`
              )
            : new MoleculerError(
                "This boot medium could not be found",
                404,
                "ERR_BOOT_MEDIUM_NOT_FOUND"
              )
          : new MoleculerError(
              "This boot medium could not be found",
              404,
              "ERR_BOOT_MEDIUM_NOT_FOUND"
            )
    },
    list: () =>
      shell.ls("-l", "/tmp/pojntfx/os/bootmedia").map(folder =>
        fs.existsSync(
          `/tmp/pojntfx/os/bootmedia/${folder.name}/package/out.iso`
        )
          ? {
              ...folder,
              id: folder.name,
              containsBootMedium: true
            }
          : {
              ...folder,
              id: folder.name,
              containsBootMedium: false
            }
      ),
    remove: {
      params: { id: "string" },
      handler: ctx => {
        if (fs.existsSync(`/tmp/pojntfx/os/bootmedia/${ctx.params.id}`)) {
          shell.rm("-rf", `/tmp/pojntfx/os/bootmedia/${ctx.params.id}`);
          return ctx.params.id;
        } else {
          throw new MoleculerError(
            "This boot medium could not be found",
            404,
            "ERR_BOOT_MEDIUM_NOT_FOUND"
          );
        }
      }
    }
  }
};
