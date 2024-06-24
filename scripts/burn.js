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

  const token = await hre.ethers.getContractAt(
    "DegenerativesArt",
    "0xBB467000b19e99d0E266866c0F05516ef1724792"
  );
  await token.burn(0);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
