const hre = require("hardhat");

function calculateTotalMintCost(startTokenId, endTokenId) {
  let totalCost = BigInt(0);

  for (let tokenId = startTokenId; tokenId <= endTokenId; tokenId++) {
    const mintPrice = BigInt(10e12) * BigInt(tokenId) ** BigInt(2); // Calculate price in wei
    totalCost += mintPrice;
  }

  const totalCostInEth = ethers.formatEther(totalCost); // Convert to ETH
  return parseFloat(totalCostInEth).toFixed(4); // Format to 4 decimal places
}

async function main() {
  const startTokenId = 0;
  const endTokenId = 900;
  const totalMintCost = calculateTotalMintCost(startTokenId, endTokenId);
  console.log(
    "Total mint cost from token ID",
    startTokenId,
    "to",
    endTokenId,
    ":",
    totalMintCost,
    "ETH"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
