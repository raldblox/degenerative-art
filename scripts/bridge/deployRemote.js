const hre = require("hardhat");

async function main() {
  const [deployer, relayer, hexalana] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  console.log("Network: ", network.name);
  console.log("Deployer", deployer.address);
  console.log("Relayer", relayer.address);
  console.log("Hexalana", hexalana.address);

  const MOOD = "0xd08B30c1EdA1284cD70E73F29ba27B5315aCc3F9"; // etherlink mainnet

  const RemoteBRIDGE = await hre.ethers.deployContract("RemoteHexalanaBridge", [
    hexalana.address,
  ]);
  await RemoteBRIDGE.waitForDeployment();
  console.log(`RemoteHexalanaBridge:${network.name}:`, RemoteBRIDGE.target);

  const wrappedMOOD = await hre.ethers.deployContract("MOOD", [
    RemoteBRIDGE.target,
  ]);
  await wrappedMOOD.waitForDeployment();
  console.log(`WrappedMOOD:${network.name}:`, wrappedMOOD.target);

  await RemoteBRIDGE.addSupportedToken(MOOD, wrappedMOOD.target);
  console.log(`WrappedMOOD added`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
