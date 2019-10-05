const { updateRepo } = require("../../utils/repo/updateRepo");
const QueueService = require("moleculer-bull");

module.exports = {
  name: "repo-worker",
  mixins: QueueService({
    redis: {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
      db: process.env.REDIS_DB,
      password: process.env.REDIS_PASSWORD
    }
  }),
  queues: {
    "repo.updateRepo": async function(job) {
      await updateRepo({
        ...job.data,
        username: process.env.MINIO_ACCESS_KEY,
        password: process.env.MINIO_SECRET_KEY,
        s3Endpoint: process.env.MINIO_HOST,
        tempdir: "/tmp/pojntfx/provisioner/repo"
      });
      function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      await timeout(2000);

      return this.Promise.resolve({
        idInQueue: job.id,
        status: "done",
        done: true
      });
    }
  }
};
