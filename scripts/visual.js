const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer Account: ", deployer.address);

  const theme = await hre.ethers.deployContract("DegenerativesVisualEngine");
  await theme.waitForDeployment();
  console.log("Degeneratives Visual Engine:", theme.target);

  const token = await hre.ethers.deployContract("Degeneratives", [
    theme.target,
  ]);
  await token.waitForDeployment();
  console.log("Degeneratives:", token.target);

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
  for (let i = 0; i < mintEmojis.length; i++) {
    const currentPrice = await token.price();
    await token.mint(mintEmojis[i], {
      value: currentPrice,
    });
  }

  console.log("tokenURI:", await token.tokenURI(7));
  await theme.evolve(1);
  console.log("----------------------------");
  console.log("tokenURI:", await token.tokenURI(1));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
