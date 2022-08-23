// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./EthPriceConsumer.sol";

contract BetPool {
    struct UserBet {
        bool choice;
        uint256 balanceOfBet;
        uint256 balanceOfGains;
    }

    address[] addressIndexes_;
    mapping(address => UserBet) usersBets_;

    bool isExecutedBet_;
    uint256 executionTimestamp_;
    EthPriceConsumer ethPriceConsumer_;

    constructor(EthPriceConsumer ethPriceConsumer, uint256 executionTimestamp) {
        isExecutedBet_ = false;
        ethPriceConsumer_ = ethPriceConsumer;
        executionTimestamp_ = executionTimestamp;
    }

    function bet(bool choice) external payable {
        UserBet storage userBets = usersBets_[msg.sender];

        require(!userBets.choice, "You have already bet");
        require(block.timestamp < executionTimestamp_);

        userBets.choice = choice;
        userBets.balanceOfBet = msg.value;

        userBets.balanceOfGains = 0;

        addressIndexes_.push(msg.sender);
    }

    function withdrawGains(address payable _to) external payable {
        require(isExecutedBet_);

        UserBet storage userBets = usersBets_[_to];

        _to.transfer(userBets.balanceOfGains);
        userBets.balanceOfGains = 0;
    }

    function execute() external {
        require(block.timestamp >= executionTimestamp_);
        require(!isExecutedBet_);

        int256 price = ethPriceConsumer_.getLatestPrice();

        for (uint256 index = 0; index < addressIndexes_.length; index++) {}

        isExecutedBet_ = true;
    }
}
