// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "./WrappedERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HexalanaBridge is Ownable(msg.sender) {
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
        address _sender,
        uint256 _amount,
        uint256 _chainId
    ) external {
        require(supportedTokens[_token], "Token not supported");
        require(
            ERC20(_token).transferFrom(_sender, address(this), _amount),
            "Token transfer failed"
        );

        emit TokenLocked(_token, _sender, _amount, _chainId);
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
        require(
            ERC20(_token).transfer(_recipient, _amount),
            "Token transfer failed"
        );
        emit TokenUnlocked(_token, _recipient, _amount, _chainId);
    }

    function updateHexalana(address _hexalana) external onlyOwner {
        hexalana = _hexalana;
    }

    function addSupportedToken(
        address _token,
        address _wrappedToken
    ) external onlyOwner {
        supportedTokens[_token] = true;
        wrappedTokenAddresses[_token] = _wrappedToken;
    }

    function removeSupportedToken(address _token) external payable onlyOwner {
        supportedTokens[_token] = false;
        delete wrappedTokenAddresses[_token];
    }
}
