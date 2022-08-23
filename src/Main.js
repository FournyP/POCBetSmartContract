import React from "react";
import propTypes from "prop-types";
import { BetPool } from "services";
import eth_logo from "./eth-logo.png";

function Main(props) {
  const { betBalance, gainBalance, isExecutedBet, afterAction, beforeAction } =
    props;

  const [amount, setAmount] = React.useState(0);

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
                Balance:{" "}
                {window.web3.utils.fromWei(this.props.daiTokenBalance, "Ether")}
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

                BetPool.bet(web3, account, weiAmount);

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

                await BetPool.withdrawGains(web3, account);

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

                await BetPool.executeBet(web3, account);

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
