const hre = require("hardhat");

async function main() {
  const [deployer, relayer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const networkName = network.name;
  const networkId = network.chainId;

  console.log(
    "Deployer",
    deployer.address,
    "| Network",
    networkName,
    networkId
  );

  const moodBank = await hre.ethers.deployContract("MoodBank");
  await moodBank.waitForDeployment();
  console.log("MoodBank", moodBank.target);

  const theme = await hre.ethers.deployContract("Expandable", [
    networkName,
    networkId,
  ]);

  await theme.waitForDeployment();
  console.log("Expandable Theme:", theme.target);

  const moodNFT = await hre.ethers.deployContract("DegenerativesNFT", [
    networkId,
    moodBank.target,
    relayer.address,
    theme.target,
  ]);

  await moodNFT.waitForDeployment();
  console.log("Mood NFT:", moodNFT.target);

  await moodBank.authorize(moodNFT.target, true);
  await moodBank.authorize(relayer.address, true);

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

  // for (let i = 0; i < moods.length; i++) {
  //   const totalSupply = await moodNFT.totalSupply();
  //   const currentPrice = await moodNFT.price(totalSupply);
  //   console.log("minting", totalSupply);
  //   await moodNFT.mint(
  //     deployer.address,
  //     moods[i],
  //     i,
  //     true,
  //     0,
  //     deployer.address,
  //     {
  //       value: currentPrice,
  //     }
  //   );
  //   await new Promise((resolve) => setTimeout(resolve, 100));
  // }

  // console.log(await moodNFT.totalSupply());
  // const token1 = await moodNFT.tokenByIndex(1);
  // console.log(await moodNFT.getMood(token1));
  // console.log(await moodNFT.tokenURI(token1));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
