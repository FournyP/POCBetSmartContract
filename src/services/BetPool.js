import BetPool from "abis/BetPool.json";

async function createBetPoolInstance(web3) {
  let networkId = await web3.eth.net.getId();

  let comptrollerData = BetPool.networks[networkId];

  if (comptrollerData) {
    return new web3.eth.Contract(BetPool.abi, comptrollerData.address);
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
  let balance = await betPoolContract.methods.balanceOfGains(account).call();

  return web3.utils.fromWei(balance, "Ether");
}

export async function getBets(web3, account) {
  let betPoolContract = await createBetPoolInstance(web3);
  let balance = await betPoolContract.methods.balanceOfBets(account).call();

  return web3.utils.fromWei(balance, "Ether");
}

export async function isExecutedBet(web3) {
  let betPoolContract = await createBetPoolInstance(web3);

  return betPoolContract.methods.isExecutedBet_().call();
}
