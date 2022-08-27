import EthPriceBetPool from "../abis/EthPriceBetPool.json";

async function createBetPoolInstance(web3) {
  let networkId = await web3.eth.net.getId();

  let ethPriceBetPoolData = EthPriceBetPool.networks[networkId];

  if (ethPriceBetPoolData) {
    return new web3.eth.Contract(
      EthPriceBetPool.abi,
      ethPriceBetPoolData.address
    );
  }
}

export async function bet(web3, account, choice, amount) {
  let betPoolContract = await createBetPoolInstance(web3);

  return new Promise((resolve, reject) => {
    betPoolContract.methods
      .bet(choice, { value: web3.utils.toWei(amount, "ether") })
      .send({ from: account })
      .on("transactionHash", () => {
        resolve(true);
      })
      .catch(() => {
        reject();
      });
  });
}

export async function withdrawGains(web3, account) {
  let betPoolContract = await createBetPoolInstance(web3);

  return new Promise((resolve, reject) => {
    betPoolContract.methods
      .withdrawGains()
      .send({ from: account })
      .on("transactionHash", () => {
        resolve(true);
      })
      .catch(() => {
        reject();
      });
  });
}

export async function executeBet(web3, account) {
  let betPoolContract = await createBetPoolInstance(web3);

  return new Promise((resolve, reject) => {
    betPoolContract.methods
      .execute()
      .send({ from: account })
      .on("transactionHash", () => {
        resolve(true);
      })
      .catch(() => {
        reject();
      });
  });
}

export async function getGains(web3, account) {
  let betPoolContract = await createBetPoolInstance(web3);
  let balance = await betPoolContract.methods.getBalanceOfGain(account).call();

  return web3.utils.fromWei(balance, "Ether");
}

export async function getBets(web3, account) {
  let betPoolContract = await createBetPoolInstance(web3);
  let balance = await betPoolContract.methods.getBalanceOfBet(account).call();

  return web3.utils.fromWei(balance, "Ether");
}

export async function isExecutedBet(web3) {
  let betPoolContract = await createBetPoolInstance(web3);

  return betPoolContract.methods.getIsExecutedBet().call();
}
