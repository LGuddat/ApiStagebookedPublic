var DataTypes = require("sequelize").DataTypes;
var _user_jobs = require("./user_jobs");
var _user_testsite = require("./user_testsite");
var _user_website = require("./user_website");
var _emails = require("./emails");
var _gallery = require("./gallery");
var _domainRequest = require("./domainrequest");
var _links = require("./user_links")

function initModels(sequelize) {
  var user_jobs = _user_jobs(sequelize, DataTypes);
  var user_testsite = _user_testsite(sequelize, DataTypes);
  var user_website = _user_website(sequelize, DataTypes);
  var emails = _emails(sequelize, DataTypes);
  var gallery = _gallery(sequelize, DataTypes);
  var domainRequest = _domainRequest(sequelize, DataTypes);
  var user_links = _links(sequelize, DataTypes);

  // Define the "one-to-many" relationship between user_website and user_jobs
  user_website.hasMany(user_jobs, {
    foreignKey: "website_id", // This must match the foreign key column in user_jobs
    as: "jobs", // This is how you will refer to the user_jobs from a user_website instance
  });

  user_jobs.belongsTo(user_website, {
    foreignKey: "website_id", // Ensure this matches the key used in hasMany
    as: "website", // This is how you will refer to the user_website from a user_jobs instance
  });

  return {
    user_jobs,
    user_links,
    user_testsite,
    user_website,
    emails,
    gallery,
    domainRequest,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
