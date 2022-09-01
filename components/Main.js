import React from "react";
import Image from "next/image";
import propTypes from "prop-types";
import { EthPriceBetPool } from "../services";
import eth_logo from "../public/eth-logo.png";

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
        let balance = parseFloat(
          window.web3.utils.fromWei(await window.web3.eth.getBalance(account))
        );
        setEthBalance(balance.toFixed(2));
      };
      fetchEthBalance();
    }
  }, [account]);

  return (
    <div id="content" className="mt-3">
      <div className="row mb-4">
        <div className="col">
          <h2>Is Ethereum price greater than 1200$ ?</h2>
        </div>
      </div>
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
                  <Image
                    width="32px"
                    height="32px"
                    src={eth_logo}
                    alt="eth_logo"
                  />
                  &nbsp;&nbsp;&nbsp; ETH
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <button
                  className="btn btn-primary btn-block btn-lg"
                  onClick={async (event) => {
                    event.preventDefault();
                    try {
                      beforeAction();

                      await EthPriceBetPool.bet(
                        window.web3,
                        account,
                        true,
                        amount
                      );
                    } catch (e) {
                      console.log();
                    } finally {
                      afterAction();
                    }
                  }}
                >
                  BET TRUE!
                </button>
              </div>
              <div className="col">
                <button
                  className="btn btn-primary btn-block btn-lg"
                  onClick={async (event) => {
                    event.preventDefault();
                    try {
                      beforeAction();

                      await EthPriceBetPool.bet(
                        window.web3,
                        account,
                        false,
                        amount
                      );
                    } catch (e) {
                      console.log(e);
                    } finally {
                      afterAction();
                    }
                  }}
                >
                  BET FALSE!
                </button>
              </div>
            </div>
          </form>
          {isExecutedBet ? (
            <button
              className="btn btn-link btn-block btn-sm"
              onClick={async (event) => {
                event.preventDefault();
                try {
                  beforeAction();

                  await EthPriceBetPool.withdrawGains(window.web3, account);
                } catch (e) {
                  console.log(e);
                } finally {
                  afterAction();
                }
              }}
            >
              Withdraw Gains
            </button>
          ) : (
            <button
              className="btn btn-link btn-block btn-sm"
              onClick={async (event) => {
                event.preventDefault();
                try {
                  beforeAction();

                  await EthPriceBetPool.executeBet(window.web3, account);
                } catch (e) {
                  console.log(e);
                } finally {
                  afterAction();
                }
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
