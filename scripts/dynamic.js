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
    await theme.calcOpacity("0x0000704b5427D1BE19059Ee68BAdb88935E6079a")
  );

  console.log(
    "metadata:",
    await theme.generateMetadata(
      1,
      "0x0000704b5427D1BE19059Ee68BAdb88935E6079a",
      mintEmojis[0],
      1
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
