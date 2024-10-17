// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

interface IHexalanaBridge {
    function lockTokens(
        address _token,
        address _sender,
        uint256 _amount,
        uint256 _chainId
    ) external payable;

    function unlockTokens(
        address _token,
        address _recipient,
        uint256 _amount,
        uint256 _chainId
    ) external;
}
