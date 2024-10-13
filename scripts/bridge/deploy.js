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

  // 1. Deploy the original MOOD ERC20 token (on Etherlink)
  const MOOD = await hre.ethers.deployContract("MockMOOD", {
    network: "etherlinkTestnet", // Make sure to deploy on Etherlink
  });
  await MOOD.waitForDeployment();
  console.log("MOOD deployed to:", MOOD.target);

  const BRIDGE = await hre.ethers.deployContract("HexalanaBridge", [
    hexalana.address,
  ]);
  await BRIDGE.waitForDeployment();
  console.log(`HexalanaBridge deployed to ${network.name}:`, BRIDGE.target);

  const wrappedMOOD = await hre.ethers.deployContract("MOOD", [BRIDGE.target]);
  await wrappedMOOD.waitForDeployment();
  console.log(`WrappedMOOD deployed to ${network.name}:`, wrappedMOOD.target);

  // Add MOOD as a supported token on each bridge
  await BRIDGE.addSupportedToken(MOOD.target, wrappedMOOD.target);
  console.log(`MOOD added.`);

  // // Perform bridge 100 tokens to Core from Etherlink
  // const amount = ethers.parseEther("100");
  // await MOOD.approve(BRIDGE.target, amount);
  // console.log(
  //   `Approved allowance:`,
  //   await MOOD.allowance(deployer.address, BRIDGE.target)
  // );

  // const lockTx = await BRIDGE.lockTokens(
  //   MOOD.target,
  //   amount,
  //   CHAIN_ID_FOR_CORE
  // );
  // await lockTx.wait();

  // console.log(`Locked Balance:`, await MOOD.balanceOf(BRIDGE.target));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
