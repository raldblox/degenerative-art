const hre = require("hardhat");
const fs = require("fs");

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

  const DegenerativesArtV3 = await hre.ethers.getContractAt(
    "DegenerativesArtV3",
    "0x5F440745E21D2F0388F7360586e8d92a9058BccC"
  );
  console.log("DegenerativesArtV3:", DegenerativesArtV3.target);

  // Read the v2.json file
  const v2Data = JSON.parse(fs.readFileSync("v2.json", "utf8"));

  // Set the starting tokenId to 5
  let nextTokenIdToMint = 935;

  for (const tokenData of v2Data) {
    const tokenId = tokenData.tokenId;
    // Skip tokens with IDs less than the starting tokenId
    if (tokenId < nextTokenIdToMint) {
      continue;
    }
    const emojis = tokenData.emojis;
    const moodSwingCount = tokenData.swing;
    const toBurn = tokenData.isBurned;

    console.log("migrating", tokenId, "toBurn:", toBurn);
    console.log("emojis", emojis);
    console.log("moodSwingCount", moodSwingCount);

    // Assuming your migrate function takes these arguments
    await DegenerativesArtV3.migrate(tokenId, emojis, moodSwingCount, toBurn);
    if (toBurn) {
      await DegenerativesArtV3.burn(tokenId);
    }

    console.log("tokenIds:", await DegenerativesArtV3.tokenIds());
    console.log("totalSupply:", await DegenerativesArtV3.totalSupply());
    console.log("totalMoodSwing:", await DegenerativesArtV3.totalMoodSwing());
    console.log("------------------------------------------");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
