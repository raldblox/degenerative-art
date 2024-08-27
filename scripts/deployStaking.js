const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const networkName = network.name;
  console.log(
    "Deployer Account: ",
    deployer.address,
    "| networkName: ",
    networkName
  );

  const LPStaking = await hre.ethers.deployContract("LPStaking");
  await LPStaking.waitForDeployment();
  console.log("LPStaking:", LPStaking.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
