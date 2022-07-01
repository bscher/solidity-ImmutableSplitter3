var ImmutableSplitter3 = artifacts.require("./ImmutableSplitter3.sol");

module.exports = function (deployer, _, accounts) {
    deployer.deploy(ImmutableSplitter3, accounts[1], accounts[2], accounts[3]);
};