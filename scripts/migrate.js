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

  const DegenerativesArtV2 = await hre.ethers.getContractAt(
    "DegenerativesArtV2",
    "0xa3c4e2C4772B879FD82Dd9a6735B4ee8a600B54F"
  );
  console.log("DegenerativesArtV2:", DegenerativesArtV2.target);

  for (let tokenId = 2; tokenId < 604; tokenId++) {
    console.log("migrating", tokenId);
    await DegenerativesArtV2.migrate(tokenId);
    console.log("Supply:", await DegenerativesArtV2.totalSupply());
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
