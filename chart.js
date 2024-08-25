const fs = require("fs");
const { ethers } = require("ethers");

const calculateMintPrice = (totalSupply) => {
  const priceInWei = BigInt(10e12) * BigInt(totalSupply) ** BigInt(2);
  const priceInEth = ethers.formatEther(priceInWei);
  return parseFloat(priceInEth).toFixed(5);
};

// Calculate for every 5th supply value
const priceData = Array.from({ length: 1000 }, (_, i) => ({
  name: `TOKEN ID#${(i * 10).toString()}`,
  supply: (i * 10).toString(),
  price: calculateMintPrice(i * 10),
}));

fs.writeFileSync("price_data.json", JSON.stringify(priceData, null, 2));
