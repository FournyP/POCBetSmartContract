import React from "react";
import propTypes from "prop-types";
import { EthPriceBetPool } from "./services";
import eth_logo from "./eth-logo.png";

function Main(props) {
  const {
    account,
    betBalance,
    gainBalance,
    afterAction,
    beforeAction,
    isExecutedBet,
  } = props;

  const [amount, setAmount] = React.useState(0);
  const [ethBalance, setEthBalance] = React.useState(0);

  React.useEffect(() => {
    if (account) {
      let fetchEthBalance = async () => {
        let balance = parseInt(
          window.web3.utils.fromWei(await window.web3.eth.getBalance(account))
        );

        setEthBalance(balance);
      };
      fetchEthBalance();
    }
  }, [account]);

  return (
    <div id="content" className="mt-3">
      <table className="table table-borderless text-muted text-center">
        <thead>
          <tr>
            <th scope="col">Bet Balance</th>
            <th scope="col">Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{betBalance} ETH</td>
            <td>{gainBalance} ETH</td>
          </tr>
        </tbody>
      </table>

      <div className="card mb-4">
        <div className="card-body">
          <form className="mb-3">
            <div className="mb-3">
              <label className="float-left">
                <b>Bet Tokens</b>
              </label>
              <span className="float-right text-muted">
                Balance: {ethBalance}
              </span>
            </div>
            <div className="input-group mb-4">
              <input
                type="text"
                className="form-control form-control-lg"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={eth_logo} height="32" alt="" />
                  &nbsp;&nbsp;&nbsp; ETH
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={async (event) => {
                event.preventDefault();

                beforeAction();

                let web3 = window.web3;
                let account = await web3.eth.getAccounts()[0];
                let weiAmount = window.web3.utils.toWei(amount, "Ether");

                EthPriceBetPool.bet(web3, account, weiAmount);

                afterAction();
              }}
            >
              BET!
            </button>
          </form>
          {isExecutedBet ? (
            <button
              className="btn btn-link btn-block btn-sm"
              onClick={async (event) => {
                event.preventDefault();
                beforeAction();

                let web3 = window.web3;
                let account = await web3.eth.getAccounts()[0];

                await EthPriceBetPool.withdrawGains(web3, account);

                afterAction();
              }}
            >
              Withdraw Gains
            </button>
          ) : (
            <button
              className="btn btn-link btn-block btn-sm"
              onClick={async (event) => {
                event.preventDefault();

                beforeAction();

                let web3 = window.web3;
                let account = await web3.eth.getAccounts()[0];

                await EthPriceBetPool.executeBet(web3, account);

                afterAction();
              }}
            >
              Execute
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

Main.defaultProps = {
  afterAction: propTypes.func.isRequired,
  beforeAction: propTypes.func.isRequired,
  betBalance: propTypes.number.isRequired,
  gainBalance: propTypes.number.isRequired,
  isExecutedBet: propTypes.func.isRequired,
};

export default Main;
