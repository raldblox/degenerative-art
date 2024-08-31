const hre = require("hardhat");

async function main() {
  const [deployer, wallet1] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const networkName = network.name;
  console.log(
    "Deployer Account: ",
    deployer.address,
    "| networkName: ",
    networkName
  );

  const theme = await hre.ethers.deployContract("Dynamic", [networkName]);
  await theme.waitForDeployment();
  console.log("Dynamic Theme:", theme.target);

  const mood = await hre.ethers.getContractAt(
    "ERC20",
    "0xd08b30c1eda1284cd70e73f29ba27b5315acc3f9"
  );

  console.log("Mood Token:", mood.target);

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

  console.log(
    "opacity:",
    await theme.calcOpacity("0xFf8B5E8E0D2242526cbf0F4B76B51690F6b70826")
  );

  console.log(
    "image:",
    await theme.generateImage(
      1,
      "0xFf8B5E8E0D2242526cbf0F4B76B51690F6b70826",
      mintEmojis[0]
    )
  );

  console.log(
    "opacity:",
    await theme.calcOpacity("0x914bC99c05489f9AE6625402E0003b3a9488eb98")
  );

  console.log(
    "image:",
    await theme.generateImage(
      1,
      "0x914bC99c05489f9AE6625402E0003b3a9488eb98",
      mintEmojis[0]
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
