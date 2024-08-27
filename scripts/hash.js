const hre = require("hardhat");
const fs = require("fs"); // Import the file system module

async function main() {
  const [deployer, wallet1] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  const DegenerativesArtV2 = await hre.ethers.getContractAt(
    "DegenerativesArtV2",
    "0xa3c4e2C4772B879FD82Dd9a6735B4ee8a600B54F"
  );
  console.log("DegenerativesArtV2:", DegenerativesArtV2.target);

  const totalSupply = await DegenerativesArtV2.totalSupply();

  let allTokenData = [];
  let duplicateHashes = {};

  for (let tokenId = 0; tokenId < 810; tokenId++) {
    const emojis = await DegenerativesArtV2.getEmojis(tokenId);
    const emojisCopy = [...emojis];
    const hash = await DegenerativesArtV2.emojiHash(emojisCopy);
    const swing = await DegenerativesArtV2.getMoodSwing(tokenId);
    console.log(tokenId, emojisCopy, hash);

    allTokenData.push({
      tokenId,
      emojis,
      swing,
      hash,
    });

    // Check for duplicate hashes
    if (duplicateHashes[hash]) {
      duplicateHashes[hash].push(tokenId);
    } else {
      duplicateHashes[hash] = [tokenId];
    }
  }

  // Write all token data to a JSON file
  fs.writeFileSync(
    "all_token_data.json",
    JSON.stringify(
      allTokenData,
      (key, value) => (typeof value === "bigint" ? value.toString() : value),
      2
    )
  );

  // Process duplicate hashes and identify the first minter (lowest mood swing)
  let duplicateTokenData = [];
  for (const hash in duplicateHashes) {
    if (duplicateHashes[hash].length > 1) {
      // Only consider actual duplicates
      let lowestSwingTokenId = duplicateHashes[hash][0];
      for (const tokenId of duplicateHashes[hash]) {
        if (
          allTokenData[tokenId].swing < allTokenData[lowestSwingTokenId].swing
        ) {
          lowestSwingTokenId = tokenId;
        }
      }
      duplicateTokenData.push({
        hash,
        firstMinter: lowestSwingTokenId,
        duplicates: duplicateHashes[hash],
      });
    }
  }

  // Write duplicate token data to a separate JSON file
  fs.writeFileSync(
    "duplicate_token_data.json",
    JSON.stringify(duplicateTokenData, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
