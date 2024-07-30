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

  const theme = await hre.ethers.deployContract("Minimalist", [networkName]);
  await theme.waitForDeployment();
  console.log("Minimalist Theme:", theme.target);

  const theme2 = await hre.ethers.deployContract("Graffiti", [networkName]);
  await theme2.waitForDeployment();
  console.log("Graffiti Theme:", theme2.target);

  const mood = await hre.ethers.deployContract("MoodToken");
  await mood.waitForDeployment();
  console.log("Mood Token:", mood.target);

  const NFT = await hre.ethers.deployContract("DegenerativesArt", [
    theme.target,
    mood.target,
  ]);
  await NFT.waitForDeployment();
  console.log("DegenerativesArt:", NFT.target);

  await mood
    .connect(deployer)
    .transfer(NFT.target, 10000000000000000000000000n);

  console.log("NFT Mood Balance", await mood.balanceOf(NFT.target));
  console.log("Minter Mood Balance", await mood.balanceOf(wallet1.address));

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

  const currentPrice = await NFT.price(0);
  await NFT.connect(wallet1).mint(mintEmojis[0], theme.target, {
    value: currentPrice,
  });
  console.log("Minter NFT Balance", await NFT.balanceOf(wallet1.address));
  console.log("Minter Mood Balance", await mood.balanceOf(wallet1.address));

  // for (let i = 0; i < mintEmojis.length; i++) {
  //   const currentPrice = await NFT.price(i);
  //   console.log("minting", i);
  //   await NFT.connect(wallet1).mint(mintEmojis[i], theme2.target, {
  //     value: currentPrice,
  //   });
  //   await new Promise((resolve) => setTimeout(resolve, 100)); // Add 5-second delay
  // }

  // await NFT.updateCooldown(14400);

  console.log("theme:", await NFT.getTheme(0));
  console.log("emojis:", await NFT.getEmojis(0));
  console.log("getMoodSwing:", await NFT.getMoodSwing(0));
  console.log(
    "contract balance",
    ethers.formatEther(await mood.balanceOf(NFT.target))
  );
  console.log(
    "minter balance",
    ethers.formatEther(await mood.balanceOf(deployer.address))
  );

  // await mood
  //   .connect(deployer)
  //   .approve(NFT.target, 1000000000000000000000000n);

  // await NFT.update(0, mintEmojis[1]);

  console.log(
    "minter balance",
    ethers.formatEther(await mood.balanceOf(deployer.address))
  );
  // console.log("getMetadata:", await NFT.getMetadata(0, theme2.target));
  // console.log("tokenURI:", await NFT.tokenURI(0));
  // await theme.evolve(5);
  // console.log("----------------------------");
  // console.log("tokenURI:", await NFT.tokenURI(5));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
