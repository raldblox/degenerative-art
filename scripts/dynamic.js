const hre = require("hardhat");

async function main() {
  const [deployer, wallet1] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const networkName = network.name;
  const networkId = network.chainId;
  console.log(
    "Deploying... ",
    deployer.address,
    "|",
    networkName,
    "|",
    networkId
  );

  const theme = await hre.ethers.deployContract("Expandable", [
    networkName,
    networkId,
  ]);
  await theme.waitForDeployment();
  console.log("Dynamic Theme:", theme.target);

  const moods = [
    ["🎉"],
    ["🤪", "🥳", "🍻", "🍾", "🤑", "🔥", "🚀", "💎", "💰"],
    [
      "❤️",
      "🥰",
      "😍",
      "😘",
      "💑",
      "💏",
      "🌹",
      "💌",
      "💍",
      "🥵",
      "🔥",
      "👅",
      "💋",
      "🍑",
      "🍆",
      "💦",
      "🏩",
      "😈",
      "🤒",
      "🤧",
      "😷",
      "🤕",
      "🤢",
      "😴",
      "💊",
    ],
    [
      "💀",
      "💀",
      "💀",
      "☠️",
      "😵",
      "🤮",
      "🤢",
      "💀",
      "💀",
      "💀",
      "☠️",
      "😵",
      "🤮",
      "🤢",
      "💀",
      "💀",
      "💀",
      "☠️",
      "😵",
      "🤮",
      "🤢",
      "💀",
      "💀",
      "💀",
      "☠️",
      "😵",
      "🤮",
      "🤢",
      "💀",
      "💀",
      "💀",
      "☠️",
      "😵",
      "🤮",
      "🤢",
      "💀",
      "💀",
      "💀",
      "☠️",
      "😵",
      "🤮",
      "🤢",
      "💀",
      "💀",
      "💀",
      "☠️",
      "😵",
      "🤮",
      "🤢",
    ],
  ];

  // console.log(
  //   "text:",
  //   await theme.generateImage(0, deployer.address, moods[0])
  // );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
