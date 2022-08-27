import Web3 from "web3";
import React from "react";
import Main from "./Main";
import Navbar from "./Navbar";
import { EthPriceBetPool } from "./services";

async function loadWeb3() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
}

function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  const [account, setAccount] = React.useState("");
  const [betBalance, setBetBalance] = React.useState(0);
  const [gainBalance, setGainBalance] = React.useState(0);
  const [isExecutedBet, setIsExecutedBet] = React.useState(false);

  const loadDatas = async (web3, account) => {
    let tmpBetBalance = await EthPriceBetPool.getBets(web3, account);
    let tmpGainBalance = await EthPriceBetPool.getGains(web3, account);
    let tmpIsExecutedBet = await EthPriceBetPool.isExecutedBet(web3);

    setBetBalance(tmpBetBalance);
    setGainBalance(tmpGainBalance);
    setIsExecutedBet(tmpIsExecutedBet);
  };

  React.useEffect(() => {
    loadWeb3().then(async () => {
      const web3 = window.web3;
      const tmpAccount = (await web3.eth.getAccounts())[0];
      setAccount(tmpAccount);

      await loadDatas(web3, tmpAccount);
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      <Navbar account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ maxWidth: "600px" }}
          >
            <div className="content mr-auto ml-auto">
              {isLoading ? (
                <p id="loader" className="text-center">
                  Loading...
                </p>
              ) : (
                <Main
                  account={account}
                  beforeAction={() => {
                    setIsLoading(true);
                  }}
                  afterAction={async () => {
                    await loadDatas();
                    setIsLoading(false);
                  }}
                  betBalance={betBalance}
                  gainBalance={gainBalance}
                  isExecutedBet={isExecutedBet}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
