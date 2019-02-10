const { updateRepo } = require("../../utils/mirror/updateRepo");
const { getLogs } = require("../../utils/mirror/getLogs");
const uuidv1 = require("uuid/v1");

module.exports = {
  name: "mirror",
  actions: {
    updateRepo: {
      params: {
        remote: "string",
        skipDownload: { type: "boolean", required: false, convert: true },
        cleanCache: { type: "boolean", required: false, convert: true }
      },
      handler: async ctx => {
        id = uuidv1();
        updateRepo({
          ...ctx.params,
          username: process.env.MINIO_ACCESS_KEY,
          password: process.env.MINIO_SECRET_KEY,
          s3Endpoint: "http://localhost:9000",
          tempdir: "/tmp/pojntfx/provisioner/repo",
          id
        });
        return {
          url: "http://localhost:9000/repo",
          id,
          lastUpdate: new Date().toISOString(),
          status: "mirroring"
        };
      }
    },
    getLogs: {
      params: {
        id: "string"
      },
      handler: async ctx =>
        await getLogs(`/tmp/pojntfx/provisioner/repo/log/${ctx.params.id}/log`)
    }
  }
};
