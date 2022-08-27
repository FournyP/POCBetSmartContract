// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./EthPriceConsumer.sol";

contract EthPriceBetPool {
    struct UserBet {
        bool choice;
        uint256 balanceOfBet;
        uint256 balanceOfGains;
    }

    address[] _addressIndexes;
    mapping(address => UserBet) _usersBets;

    bool _isExecutedBet;
    int256 _ethFinalPrice;
    uint256 _executionTimestamp;
    EthPriceConsumer _ethPriceConsumer;

    constructor(
        int256 ethFinalPrice,
        uint256 executionTimestamp,
        EthPriceConsumer ethPriceConsumer
    ) {
        _isExecutedBet = false;
        _ethFinalPrice = ethFinalPrice;
        _ethPriceConsumer = ethPriceConsumer;
        _executionTimestamp = executionTimestamp;
    }

    function getBalanceOfBet(address user) external view returns (uint256) {
        UserBet memory userBet = _usersBets[user];

        return userBet.balanceOfBet;
    }

    function getBalanceOfGain(address user) external view returns (uint256) {
        UserBet memory userBet = _usersBets[user];

        return userBet.balanceOfGains;
    }

    function getIsExecutedBet() external view returns (bool) {
        return _isExecutedBet;
    }

    function bet(bool choice) external payable {
        //require(block.timestamp < _executionTimestamp); Remove for the demo
        require(
            _usersBets[msg.sender].balanceOfBet == 0,
            "You have already bet"
        );

        UserBet memory userBets = UserBet(choice, msg.value, 0);
        _usersBets[msg.sender] = userBets;

        _addressIndexes.push(msg.sender);
    }

    function withdrawGains(address payable to) external {
        require(_isExecutedBet);

        UserBet storage userBets = _usersBets[to];

        to.transfer(userBets.balanceOfGains);
        userBets.balanceOfGains = 0;
    }

    function execute() external {
        require(_addressIndexes.length > 1);
        require(block.timestamp >= _executionTimestamp);
        require(!_isExecutedBet);

        //int256 ethFinalPrice = _ethPriceConsumer.getLatestPrice();
        int256 ethFinalPrice = 1200;

        uint256 losersBetting = 0;
        uint256 winnersBetting = 0;

        for (uint256 index = 0; index < _addressIndexes.length; index++) {
            UserBet storage userBets = _usersBets[_addressIndexes[index]];

            if (ethFinalPrice < _ethFinalPrice && userBets.choice) {
                winnersBetting += userBets.balanceOfBet;
            } else {
                losersBetting += userBets.balanceOfBet;
            }
        }

        for (uint256 index = 0; index < _addressIndexes.length; index++) {
            UserBet storage userBets = _usersBets[_addressIndexes[index]];

            if (ethFinalPrice < _ethFinalPrice && userBets.choice) {
                uint256 gains = losersBetting *
                    (winnersBetting / userBets.balanceOfBet);

                userBets.balanceOfGains = userBets.balanceOfBet + gains;
            }
        }

        _isExecutedBet = true;
    }
}
