pragma solidity >=0.7.0 <0.9.0;

interface EthPriceOracleInterface {
    function getLatestEthPrice() external returns (uint256);
}
