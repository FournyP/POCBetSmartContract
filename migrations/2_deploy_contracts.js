/* eslint-disable no-undef */
const EthPriceBetPool = artifacts.require("EthPriceBetPool");
const EthPriceConsumer = artifacts.require("EthPriceConsumer");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(EthPriceConsumer);
  await EthPriceConsumer.deployed();

  let price = web3.utils.toWei("1000");
  let timestamp = Math.round((new Date().getTime() + 0.5 * 60000) / 1000);

  await deployer.deploy(
    EthPriceBetPool,
    price,
    timestamp,
    EthPriceConsumer.address
  );
  await EthPriceBetPool.deployed();
};
