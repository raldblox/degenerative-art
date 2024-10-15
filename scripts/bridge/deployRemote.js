const hre = require("hardhat");

async function main() {
  const [deployer, relayer, hexalana] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  console.log("Network: ", network.name);
  console.log("Deployer", deployer.address);
  console.log("Relayer", relayer.address);
  console.log("Hexalana", hexalana.address);

  const MOOD = "0xC5f485F6014c45e165BC1845aFE15Cb59045a2b3"; // etherlinkTestnet

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
