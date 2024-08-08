const hre = require("hardhat");

async function main() {
  const [deployer, wallet1] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const networkName = network.name;
  console.log(
    "Deployer Account: ",
    deployer.address,
    "| networkName: ",
    networkName
  );

  const WeBuyMood = await hre.ethers.deployContract("Treasury");
  await WeBuyMood.waitForDeployment();
  console.log("Treasury:", WeBuyMood.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
