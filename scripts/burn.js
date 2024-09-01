const hre = require("hardhat");

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

  const token = await hre.ethers.getContractAt(
    "DegenerativesArtV3",
    "0x9dD3b8a40627B54c63B32aF743045cb308EF5190"
  );
  console.log("ownerOf:", await token.ownerOf(3));
  console.log("balanceOf:", await token.balanceOf(deployer.address));
  await token.burn(3);
  await token.burn(5);
  console.log("ownerOf:", await token.ownerOf(3));
  console.log("balanceOf:", await token.balanceOf(deployer.address));
  // console.log("owner:", await token.balanceOf(deployer.address));
  // await tx.wait(); // Wait for the transaction to be mined
  // console.log("owner:", await token.ownerOf(3));
  // console.log("owner:", await token.getOwnedTokens(deployer.address));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
