const { assert } = require("chai");

const ImmutableSplitter3 = artifacts.require('./ImmutableSplitter3.sol');

function assertNotAnEmptyAddress(address) {
    assert.notEqual(address, 0x0);
    assert.notEqual(address, '');
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
}

contract('ImmutableSplitter3', (accounts) => {
    before(async () => {
        this.splitter = await ImmutableSplitter3.deployed();
    });

    it('has been deployed successfully', async () => {
        const address = await this.splitter.address;
        assertNotAnEmptyAddress(address);
    });

    it('only allows recipient addresses that are not empty', async () => {
        const recA = await this.splitter.recipient_A();
        assertNotAnEmptyAddress(recA);

        const recB = await this.splitter.recipient_B();
        assertNotAnEmptyAddress(recB);

        const recC = await this.splitter.recipient_C();
        assertNotAnEmptyAddress(recC);
    });

    it('can split funds equally among recipients when funds are received', async () => {
        const one_eth = web3.utils.toWei("1", "ether");
        const three_eth = web3.utils.toWei("3", "ether");

        const recA = await this.splitter.recipient_A();
        const recB = await this.splitter.recipient_B();
        const recC = await this.splitter.recipient_C();

        const recA_balance_orig = await web3.eth.getBalance(recA);
        const recB_balance_orig = await web3.eth.getBalance(recB);
        const recC_balance_orig = await web3.eth.getBalance(recC);

        await web3.eth.sendTransaction({ from: accounts[0], to: this.splitter.address, value: three_eth });

        const recA_balance_new = await web3.eth.getBalance(recA);
        const recB_balance_new = await web3.eth.getBalance(recB);
        const recC_balance_new = await web3.eth.getBalance(recC);

        assert.equal(recA_balance_new - recA_balance_orig, one_eth);
        assert.equal(recB_balance_new - recB_balance_orig, one_eth);
        assert.equal(recC_balance_new - recC_balance_orig, one_eth);
    });
});