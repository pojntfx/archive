const { createIPXE } = require("../utils/ipxe/createiPXE");
const { check } = require("../utils/ipxe/check");
const { clean } = require("../utils/ipxe/clean");
const fs = require("fs");
const shell = require("shelljs");

module.exports = {
  name: "ipxe",
  actions: {
    create: {
      params: {
        platform: "string",
        driver: "string",
        extension: "string",
        script: "string"
      },
      handler: async ctx =>
        fs.createReadStream(
          await createIPXE({
            tempdir: `/tmp/pojntfx/os`,
            ...ctx.params
          })
        )
    },
    check: async () => ({
      available: await check(true),
      missing: await check(false)
    }),
    clean: async () => clean(`/tmp/pojntfx/os`)
  }
};
