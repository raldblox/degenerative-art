const hre = require("hardhat");

async function main() {
  const [deployer, relayer, hexalana] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  console.log("Network: ", network.name);
  console.log("Deployer", deployer.address);
  console.log("Relayer", relayer.address);
  console.log("Hexalana", hexalana.address);

  const CHAIN_ID_FOR_CORE = 1115;
  const CHAIN_ID_FOR_ETHERLINK = 128123;
  const MOOD = "0x58bA0e99f706083d2c3F1Be6099A97f71Bf7f6fd";

  const BRIDGE = await hre.ethers.deployContract("RemoteHexalanaBridge", [
    hexalana.address,
  ]);
  await BRIDGE.waitForDeployment();
  console.log(`HexalanaBridge deployed to ${network.name}:`, BRIDGE.target);

  const wrappedMOOD = await hre.ethers.deployContract("MOOD", [BRIDGE.target]);
  await wrappedMOOD.waitForDeployment();
  console.log(`WrappedMOOD deployed to ${network.name}:`, wrappedMOOD.target);

  // Add MOOD as a supported token on each bridge
  await BRIDGE.addSupportedToken(MOOD, wrappedMOOD.target);
  console.log(`WrappedMOOD added`);

  // // Perform bridge 100 tokens to Core from Etherlink
  // const amount = ethers.parseEther("100");

  // const lockTx = await BRIDGE.connect(hexalana).unlockTokens(
  //   MOOD,
  //   deployer.address,
  //   amount,
  //   CHAIN_ID_FOR_ETHERLINK
  // );
  // await lockTx.wait();

  // console.log(
  //   `Unlocked Balance:`,
  //   await wrappedMOOD.balanceOf(deployer.address)
  // );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
