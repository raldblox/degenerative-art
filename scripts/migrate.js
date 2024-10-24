const hre = require("hardhat");

async function main() {
  const [deployer, relayer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const networkName = network.name;
  console.log("Deployer:", deployer.address, "| networkName: ", networkName);

  const V3 = await hre.ethers.getContractAt(
    "DegenerativesArtV3",
    "0x5F440745E21D2F0388F7360586e8d92a9058BccC"
  );

  console.log("DegenerativesV4:", V3.target);

  const V4 = await hre.ethers.getContractAt(
    "DegenerativesNFT",
    "0x92189966FB6c51476e24F19594907E842e8eb58F"
  );

  console.log("DegenerativesV4:", V4.target);
  console.log(await V4.name());

  const totalSupply = await V3.tokenIds();

  for (let tokenId = 3; tokenId < totalSupply; tokenId++) {
    try {
      const owner = await V3.ownerOf(tokenId);
      let emojis;

      if (tokenId > 1038) {
        emojis = await V3.getEmojis(tokenId + 1);
      } else {
        emojis = await V3.getEmojis(tokenId);
      }
      console.log(tokenId, owner, emojis.slice().join(" "));
      const newEmojis = Array.from(emojis);

      await V4.connect(relayer).mint(
        owner,
        newEmojis,
        1,
        false,
        0,
        "0xd08B30c1EdA1284cD70E73F29ba27B5315aCc3F9"
      );
      console.log("minted:", tokenId);
    } catch (error) {
      console.log(`${tokenId} is zero address`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
