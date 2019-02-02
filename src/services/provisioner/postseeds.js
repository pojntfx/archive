const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");

module.exports = {
  name: "postseeds",
  mixins: [DbService],
  adapter: new SqlAdapter(process.env.PRESEEDSCRIPTS_DB_URI),
  model: {
    name: "postseed",
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
  }
};
