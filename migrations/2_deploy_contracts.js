// var HealthToken = artifacts.require("./HealthToken.sol");/
var HealthCare = artifacts.require("./HealthCare.sol");

module.exports = function(deployer) {
  return deployer.deploy(HealthCare);
};
