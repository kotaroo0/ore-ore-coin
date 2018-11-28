var OreOreCoin = artifacts.require("./OreOreCoin.sol");
var Owned = artifacts.require("./Owned.sol");
var Members = artifacts.require("./Members.sol");
var Crowdsale = artifacts.require("./Crowdsale.sol");

module.exports = function(deployer) {
  deployer.deploy(Owned);
  deployer.deploy(Members);
  deployer.deploy(OreOreCoin, 10000, "OreOreCoin", "oc", 0).then(function() {
    return deployer.deploy(Crowdsale, 10, 5000, 100, OreOreCoin.address);
  });
};
