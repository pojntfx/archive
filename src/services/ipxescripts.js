const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");

module.exports = {
  name: "ipxescripts",
  mixins: [DbService],
  adapter: new SqlAdapter(process.env.IPXESCRIPTS_DB_URI),
  model: {
    name: "ipxescript",
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
