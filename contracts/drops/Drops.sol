// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {DegenerativesNFT} from "../v4/DegenerativesNFT.sol";

contract MoodDrops is Ownable(msg.sender), ReentrancyGuard {
    DegenerativesNFT public erc721;
    IERC20 public reward;

    bool public autoDrop = true;
    uint256 public qty = 1000 * 10 ** 18;

    uint256 public totalRewards;
    mapping(uint256 => bool) public claimed;
    mapping(address => uint256) public claimedRewards;

    event Recover(address token, address to, uint256 amount);
    event Drop(uint256 tokenId, address receiver, uint256 amount);
    event AutoDropEnabled(bool enabled);
    event RewardTokenSet(address token);
    event QtySet(uint256 amount);

    constructor(address _nft, address _reward) {
        erc721 = DegenerativesNFT(_nft);
        reward = IERC20(_reward);
    }

    function enableAutoDrop(bool _enabled) external onlyOwner {
        autoDrop = _enabled;
        emit AutoDropEnabled(_enabled);
    }

    function setRewardToken(address _token) external onlyOwner {
        reward = IERC20(_token);
        emit RewardTokenSet(_token);
    }

    function setQty(uint256 _qty) external onlyOwner {
        qty = _qty;
        emit QtySet(_qty);
    }

    receive() external payable {
        if (msg.sender == address(erc721) && autoDrop) {
            uint256 currentTokenId = erc721.tokenIds();
            drop(currentTokenId - 1);
        }
    }

    function drop(uint256 tokenId) public nonReentrant {
        require(!claimed[tokenId], "MoodDrops: Token already claimed");
        require(
            address(reward) != address(0),
            "MoodDrops: Reward token not set"
        );
        require(qty > 0, "MoodDrops: Reward quantity not set");

        if (reward.balanceOf(address(this)) >= qty) {
            address receiver = erc721.ownerOf(tokenId);
            bool sent = reward.transfer(receiver, qty);
            if (sent) {
                claimed[tokenId] = true;
                claimedRewards[receiver] += qty;
                totalRewards += qty;
                emit Drop(tokenId, receiver, qty);
            }
        }
    }

    function recover(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner {
        require(to != address(0), "MoodDrops: Cannot recover to zero address");

        if (token == address(0)) {
            (bool sent, ) = payable(to).call{value: amount}("");
            require(sent, "MoodDrops: ETH transfer failed");
        } else {
            bool sent = IERC20(token).transfer(to, amount);
            require(sent, "MoodDrops: Token transfer failed");
        }

        emit Recover(token, to, amount);
    }
}
