const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");

module.exports = {
  name: "preseeds",
  mixins: [DbService],
  adapter: new SqlAdapter(process.env.PRESEEDS_DB_URI),
  model: {
    name: "preseed",
    define: {
      title: Sequelize.STRING,
      text: Sequelize.TEXT
    }
  },
  settings: {
    entityValidator: {
      title: "string",
      text: "string"
    }
  },
  actions: {
    get: {
      params: {
        id: "string"
      },
      handler: async function(ctx) {
        const res = await this.actions.find({
          id: ctx.params.id
        });
        ctx.meta.$responseType = "text/plain";
        return res[0].text;
      }
    }
  }
};
