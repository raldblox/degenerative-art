// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {WrappedERC20} from "./WrappedERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RemoteHexalanaBridge is Ownable(msg.sender) {
    address public hexalana;

    mapping(address => bool) public supportedTokens;
    mapping(address => address) public wrappedTokenAddresses;

    event TokenLocked(
        address indexed token,
        address indexed sender,
        uint256 amount,
        uint256 chainId
    );

    event TokenUnlocked(
        address indexed token,
        address indexed recipient,
        uint256 amount,
        uint256 chainId
    );

    constructor(address _hexalana) {
        hexalana = _hexalana;
    }

    modifier onlyHexalana() {
        require(
            msg.sender == hexalana,
            "Only the hexalana can perform this action"
        );
        _;
    }

    function lockTokens(
        address _token,
        uint256 _amount,
        uint256 _chainId
    ) external {
        require(supportedTokens[_token], "Token not supported");
        require(
            WrappedERC20(_token).transferFrom(
                msg.sender,
                address(this),
                _amount
            ),
            "Token transfer failed"
        );

        WrappedERC20(_token).burn(address(this), _amount);
        emit TokenLocked(_token, msg.sender, _amount, _chainId);
    }

    function unlockTokens(
        address _token,
        address _recipient,
        uint256 _amount,
        uint256 _chainId
    ) external onlyHexalana {
        require(supportedTokens[_token], "Token not supported");
        address wrappedToken = wrappedTokenAddresses[_token];
        require(wrappedToken != address(0), "No corresponding wrapped token");

        WrappedERC20(wrappedToken).mint(_recipient, _amount); // Mint on destination chain
        emit TokenUnlocked(_token, _recipient, _amount, _chainId);
    }

    function addSupportedToken(
        address _token,
        address _wrappedToken
    ) external payable onlyOwner {
        supportedTokens[_token] = true;
        wrappedTokenAddresses[_token] = _wrappedToken;
    }

    function removeSupportedToken(address _token) external payable onlyOwner {
        supportedTokens[_token] = false;
        delete wrappedTokenAddresses[_token];
    }
}
