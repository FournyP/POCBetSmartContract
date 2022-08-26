/* eslint-disable no-undef */
/* eslint-disable jest/valid-describe-callback */
const { assert } = require("chai");

const EthPriceBetPool = artifacts.require("EthPriceBetPool"); // the contract
const EthPriceConsumer = artifacts.require("EthPriceConsumer"); // the price consumer contract

require("chai").use(require("chai-as-promised")).should();

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

contract("EthPriceBetPool Test", (accounts) => {
  //write test inside here....

  let ethPriceBetPool;
  before(async () => {
    //contract load

    let price = web3.utils.toWei("1000");
    let timestamp = Math.round((new Date().getTime() + 0.5 * 60000) / 1000);

    let ethPriceConsumer = await EthPriceConsumer.new();

    ethPriceBetPool = await EthPriceBetPool.new(
      price,
      timestamp,
      ethPriceConsumer.address
    );
  });

  // Test balanceOf
  describe("EthPriceBetPool must work", async () => {
    it("Gain ETH", async () => {
      await ethPriceBetPool.bet(true, {
        from: accounts[0],
        value: web3.utils.toWei("1"),
      });
      await ethPriceBetPool.bet(false, {
        from: accounts[1],
        value: web3.utils.toWei("1"),
      });

      await delay(30000);

      await ethPriceBetPool.execute();

      let firstAccountInitialBalance = parseInt(
        web3.utils.fromWei(await web3.eth.getBalance(accounts[0]))
      );
      let secondAccountInitialBalance = parseInt(
        web3.utils.fromWei(await web3.eth.getBalance(accounts[1]))
      );

      await ethPriceBetPool.withdrawGains(accounts[0]);
      await ethPriceBetPool.withdrawGains(accounts[1]);

      let firstAccountFinalBalance = parseInt(
        web3.utils.fromWei(await web3.eth.getBalance(accounts[0]))
      );
      let secondAccountFinalBalance = parseInt(
        web3.utils.fromWei(await web3.eth.getBalance(accounts[1]))
      );

      assert.equal(firstAccountInitialBalance + 2, firstAccountFinalBalance);
      assert.equal(secondAccountInitialBalance, secondAccountFinalBalance);
    });
  });
});
