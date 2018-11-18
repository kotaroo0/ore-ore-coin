var OreOreCoin = artifacts.require("./OreOreCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(OreOreCoin, 10000, "OreOreCoin", "oc", 0);
};
