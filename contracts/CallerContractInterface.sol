pragma solidity >=0.7.0 <0.9.0;

interface CallerContractInterface {
    function callback(uint256 _ethPrice, uint256 id) external;
}
