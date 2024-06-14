const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer Account: ", deployer.address);

  const theme = await hre.ethers.deployContract("DegenerativesVisualEngine");
  await theme.waitForDeployment();
  console.log("Degeneratives Visual Engine:", theme.target);

  const token = await hre.ethers.deployContract("DegenerativesArt", [
    theme.target,
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  ]);
  await token.waitForDeployment();
  console.log("Degeneratives:", token.target);

  await theme.setup(token.target);

  for (let i = 0; i <= 110; i++) {
    // Correct loop condition to simulate 10,000 mints
    const currentPrice = await token.price(i * 1); // Access the "price" function to calculate the current price
    console.log(
      "Price for ",
      i * 1,
      ":",
      ethers.formatEther(currentPrice),
      "ETH"
    ); // Format the price in ETH
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
