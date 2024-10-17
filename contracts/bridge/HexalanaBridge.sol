// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "./WrappedERC20.sol";
import {IHexalanaBridge} from "../interfaces/IHexalanaBridge.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract HexalanaBridge is
    Ownable(msg.sender),
    IHexalanaBridge,
    ReentrancyGuard
{
    address private hexalana;
    uint256 public bridgeFee;

    mapping(address => bool) public supportedTokens;

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
            "HexalanaBridge: only hexalana can perform this action"
        );
        _;
    }

    function lockTokens(
        address _token,
        address _sender,
        uint256 _amount,
        uint256 _chainId
    ) external payable nonReentrant {
        require(supportedTokens[_token], "HexalanaBridge: token not supported");
        require(msg.value >= bridgeFee, "HexalanaBridge: insufficient fund");
        require(
            ERC20(_token).transferFrom(_sender, address(this), _amount),
            "HexalanaBridge: token transfer failed"
        );
        (bool success, ) = payable(hexalana).call{value: msg.value}("");
        require(success, "HexalanaBridge: payment failed");
        emit TokenLocked(_token, _sender, _amount, _chainId);
    }

    function unlockTokens(
        address _token,
        address _recipient,
        uint256 _amount,
        uint256 _chainId
    ) external onlyHexalana nonReentrant {
        require(supportedTokens[_token], "HexalanaBridge: token not supported");
        require(
            ERC20(_token).transfer(_recipient, _amount),
            "HexalanaBridge: token transfer failed"
        );
        emit TokenUnlocked(_token, _recipient, _amount, _chainId);
    }

    function addSupportedToken(address _token) external onlyOwner {
        supportedTokens[_token] = true;
    }

    function removeSupportedToken(address _token) external payable onlyOwner {
        supportedTokens[_token] = false;
    }

    function updateHexalana(address _hexalana) external onlyOwner {
        hexalana = _hexalana;
    }

    function updateBridgeFee(uint256 _fee) external onlyOwner {
        bridgeFee = _fee;
    }
}
