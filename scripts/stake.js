const hre = require("hardhat");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const networkName = network.name;
  console.log(
    "Deployer Account: ",
    deployer.address,
    "| Network: ",
    networkName
  );

  const moodToken = await hre.ethers.deployContract("MoodToken");
  await moodToken.waitForDeployment();
  console.log("MoodToken deployed to:", moodToken.target);

  const stakingToken = await hre.ethers.deployContract("LiquityToken");
  await stakingToken.waitForDeployment();
  console.log("LiquityToken deployed to:", stakingToken.target);

  const stakingContract = await hre.ethers.deployContract("StakingContract", [
    stakingToken.target, // Use the actual address, not target
    moodToken.target, // Use the actual address, not target
  ]);

  await stakingContract.waitForDeployment();
  console.log("StakingContract deployed to:", stakingContract.target);

  // Mint LP tokens to addr1 and addr2
  await stakingToken.connect(addr1).pool(ethers.parseEther("100000")); // Mint to addr1

  console.log("Minted 100 LP tokens to addr1 and 50 LP tokens to addr2");

  // Approve the StakingRewards contract to spend LP tokens for both addr1 and addr2
  await stakingToken
    .connect(addr1)
    .approve(
      stakingContract.target,
      await stakingToken.balanceOf(addr1.address)
    );
  await stakingToken
    .connect(addr2)
    .approve(
      stakingContract.target,
      await stakingToken.balanceOf(addr2.address)
    );
  console.log(
    "Both addr1 and addr2 approved StakingContract to spend LP tokens"
  );

  // Stake LP tokens from addr1 and addr2
  await stakingContract.connect(addr1).stake(ethers.parseEther("100000"));
  console.log("Addr1 staked 1 LP tokens");

  // Transfer 1000 MOOD to the StakingRewards contract
  await moodToken.transfer(stakingContract.target, ethers.parseEther("100000"));
  console.log("Transferred 1000 MOOD to the StakingContract");

  // Wait for some time (simulate blocks being mined)
  console.log("Block:", await stakingContract.blockNow());
  console.log("2 days after");
  await mine(5760, { interval: 15 });
  await mine(5760, { interval: 15 });

  console.log("Block:", await stakingContract.blockNow());

  // Check earned rewards for addr1 and addr2
  const balance = await stakingToken.balanceOf(stakingContract.target);
  const mood = await stakingToken.balanceOf(stakingContract.target);
  const staked1 = await stakingContract.balanceOf(addr1.address);

  console.log("Staking Contract Balance:", ethers.formatEther(mood));
  console.log("Mood Balance:", ethers.formatEther(balance));
  console.log("Addr1 staked:", ethers.formatEther(staked1));

  // Check earned rewards for addr1 and addr2
  const earned1 = await stakingContract.calculateRewardsEarned(addr1.address);
  console.log("Addr1 earned rewards:", ethers.formatEther(earned1));

  // Claim rewards for addr1
  await stakingContract.connect(addr1).claim();
  console.log("Addr1 claimed rewards");

  // Check addr1's balance after claiming
  const addr1MoodBalance = await moodToken.balanceOf(addr1.address);
  console.log(
    "Addr1 MOOD balance after claiming:",
    ethers.formatEther(addr1MoodBalance)
  );

  await mine(5760, { interval: 15 });

  const earned1_ = await stakingContract.calculateRewardsEarned(addr1.address);
  console.log("Addr1 earned rewards:", ethers.formatEther(earned1_));

  console.log("Before Unstake:", await stakingToken.balanceOf(addr1.address));
  await stakingContract.connect(addr1).unstake(ethers.parseEther("100000"));
  console.log("Addr1 unstaked all LP tokens");
  console.log("After Unstake:", await stakingToken.balanceOf(addr1.address));

  const MoodBalance = await stakingContract.balanceOf(addr1.address);
  console.log(
    "Addr1 MOOD balance after claiming:",
    ethers.formatEther(MoodBalance)
  );

  // Check earned rewards for addr1 and addr2
  const balance2 = await stakingToken.balanceOf(stakingContract.target);
  const mood2 = await stakingToken.balanceOf(stakingContract.target);
  const staked2 = await stakingContract.balanceOf(addr1.address);

  console.log("Staking Contract Balance:", ethers.formatEther(mood2));
  console.log("Mood Balance:", ethers.formatEther(balance2));
  console.log("Addr1 staked:", ethers.formatEther(staked2));
  await stakingToken
    .connect(addr1)
    .approve(
      stakingContract.target,
      await stakingToken.balanceOf(addr1.address)
    );

  console.log("2 days after");
  await mine(5760, { interval: 15 });
  await mine(5760, { interval: 15 });
  console.log("2 days after");
  await mine(5760, { interval: 15 });
  await mine(5760, { interval: 15 });

  console.log("Before Stake:", await stakingToken.balanceOf(addr1.address));
  await stakingContract.connect(addr1).stake(ethers.parseEther("100000"));
  console.log("After Stake:", await stakingToken.balanceOf(addr1.address));
  console.log("2 days after");
  await mine(5760, { interval: 15 });
  await mine(5760, { interval: 15 });
  const earned = await stakingContract.calculateRewardsEarned(addr1.address);
  console.log("Addr1 earned rewards:", ethers.formatEther(earned));
  await stakingContract.connect(addr1).unstake(ethers.parseEther("100000"));

  console.log("Balance", await stakingContract.balanceOf(addr1.address));

  console.log(
    "Reward:",
    ethers.formatEther(
      await stakingContract.calculateRewardsEarned(addr1.address)
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
