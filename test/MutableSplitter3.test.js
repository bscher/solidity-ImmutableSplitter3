const { assert } = require("chai");

const MutableSplitter3 = artifacts.require('./MutableSplitter3.sol');

function assertNotAnEmptyAddress(address) {
    assert.notEqual(address, 0x0);
    assert.notEqual(address, '');
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
}

contract('MutableSplitter3', (accounts) => {
    before(async () => {
        this.splitter = await MutableSplitter3.deployed();
    });

    it('deploys successfully', async () => {
        const address = await this.splitter.address;
        assertNotAnEmptyAddress(address);
    });

    it('checks recipient addresses are not empty', async () => {
        const recA = await this.splitter.recipient_A();
        assertNotAnEmptyAddress(recA);

        const recB = await this.splitter.recipient_B();
        assertNotAnEmptyAddress(recB);

        const recC = await this.splitter.recipient_C();
        assertNotAnEmptyAddress(recC);
    });

    it('can set new recipients', async () => {

        const recA_orig = await this.splitter.recipient_A();
        const recB_orig = await this.splitter.recipient_B();
        const recC_orig = await this.splitter.recipient_C();

        const result = await this.splitter.setNewRecipients(
            recC_orig, recA_orig, recB_orig
        );

        assert.equal(result.logs[0].args.prevAddress, recA_orig);
        assert.equal(result.logs[0].args.newAddress, recC_orig);

        assert.equal(result.logs[1].args.prevAddress, recB_orig);
        assert.equal(result.logs[1].args.newAddress, recA_orig);

        assert.equal(result.logs[2].args.prevAddress, recC_orig);
        assert.equal(result.logs[2].args.newAddress, recB_orig);

        const recA_new = await this.splitter.recipient_A();
        const recB_new = await this.splitter.recipient_B();
        const recC_new = await this.splitter.recipient_C();

        assert.equal(recA_new, recC_orig);
        assert.equal(recB_new, recA_orig);
        assert.equal(recC_new, recB_orig);
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