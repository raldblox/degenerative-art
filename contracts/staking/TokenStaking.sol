// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LPStaking is Ownable(msg.sender) {
    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardToken;

    uint256 public totalSupply;
    uint256 private stakingFactor = 100; // @note 0.01 rewardToken per stakingToken per day

    mapping(address => uint256) public balanceOf;
    mapping(address => uint256) public earned;
    mapping(address => uint256) public lastStake;
    mapping(address => uint256) public claimed;

    constructor() {
        stakingToken = IERC20(0xC6D0AafDe70058EDA2E4F3DD17200dabD350A8D5);
        rewardToken = IERC20(0xd08B30c1EdA1284cD70E73F29ba27B5315aCc3F9);
    }

    function stake(uint256 amount) external {
        _updateRewards(msg.sender);

        balanceOf[msg.sender] += amount;
        totalSupply += amount;

        stakingToken.transferFrom(msg.sender, address(this), amount);
    }

    function unstake(uint256 amount) external {
        _updateRewards(msg.sender);

        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;

        stakingToken.transfer(msg.sender, amount);

        if (balanceOf[msg.sender] == 0) {
            lastStake[msg.sender] = 0;
        }
    }

    function calculateRewardsEarned(
        address account
    ) external view returns (uint256) {
        return _calculateRewards(account);
    }

    function _updateRewards(address account) private {
        earned[account] += _calculateRewards(account);
        lastStake[account] = block.timestamp;
    }

    function _calculateRewards(address account) public view returns (uint256) {
        uint256 shares = balanceOf[account];
        uint256 stakingTime = block.timestamp - lastStake[account];
        uint256 rewardsEarned = ((shares * stakingTime) / stakingFactor) /
            (1 days);
        return rewardsEarned;
    }

    function claim() external returns (uint256) {
        _updateRewards(msg.sender);

        uint256 reward = earned[msg.sender];
        if (reward > 0) {
            earned[msg.sender] = 0;
            rewardToken.transfer(msg.sender, reward);
        }

        claimed[msg.sender] += reward;
        return reward;
    }

    function updateStakingFactor(uint256 value) external onlyOwner {
        stakingFactor = value;
    }

    function recover(address to, uint256 amount) external onlyOwner {
        bool sent = rewardToken.transfer(to, amount);
        require(sent, "Failed");
    }
}
