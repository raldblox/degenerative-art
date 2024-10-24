const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer, relayer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const networkName = network.name;
  const networkId = network.chainId;

  console.log(
    "Deployer",
    deployer.address,
    "| Network",
    networkName,
    networkId
  );

  const v3 = await hre.ethers.getContractAt(
    "DegenerativesArtV3",
    "0x5F440745E21D2F0388F7360586e8d92a9058BccC"
  );

  console.log("MoodBank V3", v3.target);

  const totalSupply = await v3.tokenIds();
  console.log(await v3.getEmojis(totalSupply));

  let snapshot = [];

  for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
    try {
      const owner = await v3.ownerOf(tokenId);

      // Skip if owner is the zero address
      if (owner === "0x0000000000000000000000000000000000000000") {
        console.log(`Skipping tokenId ${tokenId} (owned by zero address)`);
        continue;
      }
      // if owner is zero address skip fetching
      const [emojis, moodSwing] = await Promise.all([
        v3.getEmojis(tokenId),
        v3.getMoodSwing(tokenId),
      ]);
      const moodPatterns = await v3.getMoodPattern(owner);

      snapshot.push({
        tokenId: Number(tokenId),
        owner: owner,
        emojis: emojis,
        moodSwing: moodSwing,
        moodPatterns: moodPatterns,
      });

      console.log(tokenId);
    } catch (error) {
      console.error(`Error fetching data for tokenId ${tokenId}:`);
    }
  }

  // Save the snapshot to a JSON file
  fs.writeFileSync(
    "snapshot.json",
    JSON.stringify(
      snapshot,
      (key, value) => (typeof value === "bigint" ? value.toString() : value),
      2
    )
  );
  console.log("Snapshot saved to snapshot.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
