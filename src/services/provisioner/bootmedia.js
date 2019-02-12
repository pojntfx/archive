const fs = require("../../bindings/asyncFs");
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
          packageDir: `/tmp/pojntfx/provisioner/bootmedia/${id}/package`,
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
      handler: async ctx =>
        shell
          .ls("/tmp/pojntfx/provisioner/bootmedia")
          .filter(folder => folder === ctx.params.id).length > 0
          ? (await fs.exists(
              `/tmp/pojntfx/provisioner/bootmedia/${
                ctx.params.id
              }/package/out.iso`
            ))
            ? fs.createReadStream(
                `/tmp/pojntfx/provisioner/bootmedia/${
                  ctx.params.id
                }/package/out.iso`
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
    list: async () =>
      await Promise.all(
        shell.ls("-l", "/tmp/pojntfx/provisioner/bootmedia").map(async folder =>
          (await fs.exists(
            `/tmp/pojntfx/provisioner/bootmedia/${folder.name}/package/out.iso`
          ))
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
        )
      ),
    remove: {
      params: { id: "string" },
      handler: async ctx => {
        if (
          await fs.exists(`/tmp/pojntfx/provisioner/bootmedia/${ctx.params.id}`)
        ) {
          shell.rm(
            "-rf",
            `/tmp/pojntfx/provisioner/bootmedia/${ctx.params.id}`
          );
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
