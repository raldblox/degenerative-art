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
  const LocalMOOD = await hre.ethers.deployContract("MockMOOD");
  await LocalMOOD.waitForDeployment();
  console.log("MOOD:", LocalMOOD.target);

  const LocalBRIDGE = await hre.ethers.deployContract("HexalanaBridge", [
    hexalana.address,
  ]);
  await LocalBRIDGE.waitForDeployment();
  console.log(`Local Bridge:`, LocalBRIDGE.target);

  const RemoteBRIDGE = await hre.ethers.deployContract("RemoteHexalanaBridge", [
    hexalana.address,
  ]);
  await RemoteBRIDGE.waitForDeployment();
  console.log(`Remote Bridge:`, RemoteBRIDGE.target);

  const wrappedMOOD = await hre.ethers.deployContract("MOOD", [
    RemoteBRIDGE.target,
  ]);
  await wrappedMOOD.waitForDeployment();
  console.log(`WrappedMOOD deployed to ${network.name}:`, wrappedMOOD.target);

  // Add MOOD as a supported token on each bridge
  await LocalBRIDGE.addSupportedToken(LocalMOOD.target);
  await RemoteBRIDGE.addSupportedToken(LocalMOOD.target, wrappedMOOD.target);
  console.log(`MOOD supported.`);

  // // Perform bridge 100 tokens to Core from Etherlink
  const amount = ethers.parseEther("10000");
  await LocalMOOD.approve(LocalBRIDGE.target, amount);
  console.log(
    `Approved allowance:`,
    await LocalMOOD.allowance(deployer.address, LocalBRIDGE.target)
  );

  const lockTx = await LocalBRIDGE.connect(hexalana).lockTokens(
    LocalMOOD.target,
    deployer.address,
    amount,
    CHAIN_ID_FOR_CORE
  );
  await lockTx.wait();

  console.log(`Locked Balance:`, await LocalMOOD.balanceOf(LocalBRIDGE.target));

  // validate events

  const unlockTx = await RemoteBRIDGE.connect(hexalana).unlockTokens(
    LocalMOOD.target,
    deployer.address,
    amount,
    CHAIN_ID_FOR_ETHERLINK
  );
  await unlockTx.wait();
  console.log(`Unlock supported.`);

  console.log(`Remote Balance:`, await wrappedMOOD.balanceOf(deployer.address));

  // lock
  await wrappedMOOD.approve(RemoteBRIDGE.target, amount);
  console.log(
    `Approved allowance:`,
    await wrappedMOOD.allowance(deployer.address, RemoteBRIDGE.target)
  );
  const remoteLockTx = await RemoteBRIDGE.connect(hexalana).lockTokens(
    LocalMOOD.target,
    deployer.address,
    amount,
    CHAIN_ID_FOR_ETHERLINK
  );
  await remoteLockTx.wait();
  console.log(
    `New Remote Balance:`,
    await wrappedMOOD.balanceOf(deployer.address)
  );

  // unlock
  const localUnlockTx = await LocalBRIDGE.connect(hexalana).unlockTokens(
    LocalMOOD.target,
    deployer.address,
    amount,
    CHAIN_ID_FOR_CORE
  );
  await localUnlockTx.wait();
  console.log(`Balance:`, await LocalMOOD.balanceOf(deployer.address));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
