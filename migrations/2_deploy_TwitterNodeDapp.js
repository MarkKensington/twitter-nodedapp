const TwitterNodeDapp = artifacts.require("TwitterNodeDapp");

module.exports = function(deployer) {
  deployer.deploy(TwitterNodeDapp);
};
