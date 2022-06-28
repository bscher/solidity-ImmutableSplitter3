var MutableSplitter3 = artifacts.require("./MutableSplitter3.sol");

module.exports = function (deployer, _, accounts) {
    deployer.deploy(MutableSplitter3, accounts[1], accounts[2], accounts[3]);
};