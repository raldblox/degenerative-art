const hre = require("hardhat");

async function main() {
  const [deployer, relayer, hexalana] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  console.log("Network: ", network.name);
  console.log("Deployer", deployer.address);
  console.log("Relayer", relayer.address);
  console.log("Hexalana", hexalana.address);

  const MOOD = await hre.ethers.deployContract("MockMOOD");
  await MOOD.waitForDeployment();
  console.log("MOOD deployed to:", MOOD.target);

  const LocalBRIDGE = await hre.ethers.deployContract("HexalanaBridge", [
    hexalana.address,
  ]);
  await LocalBRIDGE.waitForDeployment();

  console.log(`Local HexalanaBridge: ${network.name}:`, LocalBRIDGE.target);

  await LocalBRIDGE.addSupportedToken(MOOD.target);
  console.log(`MOOD added.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
