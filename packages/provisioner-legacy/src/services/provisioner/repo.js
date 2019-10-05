const QueueService = require("moleculer-bull");
const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");

module.exports = {
  name: "repo",
  mixins: [
    QueueService({
      redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        db: process.env.REDIS_DB,
        password: process.env.REDIS_PASSWORD
      }
    }),
    DbService
  ],
  adapter: new SqlAdapter(process.env.REPO_MARIADB_URI),
  model: {
    name: "update",
    define: {
      idInQueue: Sequelize.STRING,
      lastUpdate: Sequelize.DATE,
      status: Sequelize.STRING
    }
  },
  settings: {
    entityValidator: {
      idInQueue: "string",
      lastUpdate: "string",
      status: "string"
    }
  },
  actions: {
    updateRepo: {
      params: {
        remote: "string",
        skipDownload: { type: "boolean", required: false, convert: true },
        cleanCache: { type: "boolean", required: false, convert: true }
      },
      handler: async function(ctx) {
        // Little helper for accessing weird properties
        const getProperty = (property, target) =>
          JSON.stringify(target)
            .split(property)[1]
            .split(":")[1]
            .split(",")[0]
            .replace(/\\"/g, "");

        const repoInQueue = await this.createJob("repo.updateRepo", {
          ...ctx.params
        });
        const repoInDb = await ctx.call("repo.create", {
          idInQueue: repoInQueue.id,
          lastUpdate: new Date().toISOString(),
          status: "mirroring"
        });
        await this.getQueue("repo.updateRepo").on(
          "global:completed",
          async (_, res) => {
            const jobIdInQueue = getProperty("idInQueue", res);
            const status = getProperty("status", res);
            if (jobIdInQueue === repoInDb.idInQueue) {
              await ctx.call("repo.update", {
                id: repoInDb.id,
                status
              });
            }
          }
        );
        return repoInDb;
      }
    }
  }
};
