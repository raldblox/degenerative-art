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

  const theme = await hre.ethers.deployContract("DegenerativesVisualEngine", [
    networkName,
  ]);
  await theme.waitForDeployment();
  console.log("Degeneratives Visual Engine:", theme.target);

  const token = await hre.ethers.deployContract("DegenerativesArt", [
    theme.target,
  ]);
  await token.waitForDeployment();
  console.log("DegenerativesArt:", token.target);

  await theme.setup(token.target);

  const mintEmojis = [
    ["🎉", "🎊", "🥳", "🎈", "🍾", "🥂", "🎂", "🎁", "🎆"],
    ["🤪", "🥳", "🍻", "🍾", "🤑", "🔥", "🚀", "💎", "💰"],
    ["❤️", "🥰", "😍", "😘", "💑", "💏", "🌹", "💌", "💍"],
    ["🥵", "🔥", "👅", "💋", "🍑", "🍆", "💦", "🏩", "😈"],
    ["🤒", "🤧", "😷", "🤕", "🤢", "😴", "💊", "💉", "🌡️"],
    ["💀", "💀", "💀", "☠️", "😵", "🤮", "🤢", "💀", "☠️"],
    ["😡", "😠", "🤬", "😤", "💢", "💥", "😡", "😠", "🤬"],
    ["🤬", "🖕", "🔪", "💣", "☠", "👹", "🤬", "🖕", "🔪"],
    ["🎲", "🎰", "🃏", "🤑", "💸", "💰", "🚀", "🌙", "🤞"],
    ["🔞", "🍑", "🍆", "💦", "😏", "😈", "👅", "🔞", "🍑"],
    ["💀", "☠️", "☢️", "☣️", "😈", "🔪", "🩸", "💀", "☠️"],
  ];
  const currentPrice = await token.price(0);
  await token.mint(mintEmojis[0], { value: currentPrice });

  // for (let i = 0; i < mintEmojis.length; i++) {
  //   const currentPrice = await token.price(i);
  //   console.log("minting", i);
  //   await token.mint(deployer.address, mintEmojis[i], { value: currentPrice });

  //   await new Promise((resolve) => setTimeout(resolve, 5000)); // Add 5-second delay
  // }

  // console.log("tokenURI:", await token.tokenURI(0));
  // await theme.evolve(5);
  // console.log("----------------------------");
  // console.log("tokenURI:", await token.tokenURI(5));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
