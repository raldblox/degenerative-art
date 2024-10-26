const hre = require("hardhat");

async function main() {
  const [deployer, relayer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const networkName = network.name;
  console.log("Deployer:", deployer.address, "| networkName: ", networkName);

  const MoodDrops = await hre.ethers.getContractAt(
    "MoodDrops",
    "0x8a378D515304992E219190680018AA716525EF06"
  );

  // const MoodDrops = await hre.ethers.deployContract("MoodDrops", [
  //   "0xBF28585d32faEAf2F58E9Ab15966989f49C3dFfa",
  //   "0xF9E3B82457DA8E1064397b6AC9f72558d5fD25Ab",
  // ]);
  await MoodDrops.waitForDeployment();

  console.log("MoodDrops:", MoodDrops.target);

  const minTokenId = 845300000000000000000n; // Define the minimum tokenId

  async function dropTokens() {
    try {
      for (
        let tokenId = 845300000000000000019n;
        tokenId >= minTokenId;
        tokenId--
      ) {
        try {
          const tx = await MoodDrops.drop(tokenId);
          await tx.wait();
          console.log(`Drop successful for tokenId: ${tokenId}`);
        } catch (error) {
          console.error(
            `Error dropping for tokenId: ${tokenId}, Error:`,
            error
          );
        }
      }
      console.log("All tokens dropped.");
    } finally {
    }
  }

  dropTokens();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
