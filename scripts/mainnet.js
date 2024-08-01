const hre = require("hardhat");

async function main() {
  const [deployer, wallet_0x01] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const networkName = network.name;
  console.log(
    "Deployer Account: ",
    deployer.address,
    "| networkName: ",
    networkName
  );

  const mood = await hre.ethers.getContractAt(
    "ERC20",
    "0xd08b30c1eda1284cd70e73f29ba27b5315acc3f9"
  );
  console.log("Mood Token:", mood.target);
  console.log(
    "deployer's mood balance",
    ethers.formatEther(await mood.balanceOf(deployer.address))
  );

  console.log(
    "wallet_0x01's mood balance",
    ethers.formatEther(await mood.balanceOf(wallet_0x01.address))
  );

  const theme = await hre.ethers.getContractAt(
    "Minimalist",
    "0x8dc9c31AC117b29396399C2C8031b99B1af59457"
  );
  console.log("Minimalist Theme:", theme.target);

  const theme2 = await hre.ethers.getContractAt(
    "Graffiti",
    "0x749cc8541c06BBC9De0CD0373fCEF70B6373c6Ee"
  );

  console.log("Graffiti Theme:", theme2.target);

  const NFT = await hre.ethers.getContractAt(
    "DegenerativesArt",
    "0xcf552524772605de32dae649f7ced60a286b0d21"
  );
  console.log("DegenerativesArt:", NFT.target);

  // console.log("DEGENART BALANCE", await mood.balanceOf(NFT.target));
  console.log("DEGENART BALANCE", await mood.balanceOf(NFT.target));
  console.log("wallet_0x01 BALANCE", await mood.balanceOf(wallet_0x01.address));

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

  // for (let i = 5; i < mintEmojis.length; i++) {
  //   const currentPrice = await NFT.price(i);
  //   console.log("minting", i);
  //   await NFT.mint(mintEmojis[i], theme.target, { value: currentPrice });
  //   await new Promise((resolve) => setTimeout(resolve, 2000)); // Add 5-second delay
  // }

  console.log("treasury:", await NFT.treasury());
  const currentSupply = await NFT.totalSupply();
  const currentPrice = await NFT.price(currentSupply);
  console.log("minting", currentSupply);

  console.log(
    "LastMoodUpdate:",
    await NFT.getLastMoodUpdate(wallet_0x01.address)
  );

  await NFT.connect(wallet_0x01).mint(mintEmojis[1], theme.target, {
    value: currentPrice,
  });

  console.log(
    "LastMoodUpdate:",
    await NFT.getLastMoodUpdate(wallet_0x01.address)
  );

  // await NFT.updateTreasury("0x8C60817577d6Cdb440436844c9B3898d0d069F00");

  // console.log("treasury:", await NFT.treasury());
  // await NFT.updateCooldown(14400);

  console.log("treasury:", await NFT.treasury());

  // console.log("theme:", await NFT.getTheme(0));
  // console.log("emojis:", await NFT.getEmojis(0));
  // console.log("getMoodSwing:", await NFT.getMoodSwing(0));
  // console.log(
  //   "contract balance",
  //   ethers.formatEther(await mood.balanceOf(NFT.target))
  // );
  // console.log(
  //   "minter balance",
  //   ethers.formatEther(await mood.balanceOf(deployer.address))
  // );

  // await mood.connect(deployer).approve(NFT.target, 1000000000000000000000000n);

  // await NFT.update(0, mintEmojis[1]);

  // console.log(
  //   "minter balance",
  //   ethers.formatEther(await mood.balanceOf(deployer.address))
  // );
  // // console.log("getMetadata:", await NFT.getMetadata(0, theme2.target));
  // console.log("tokenURI:", await NFT.tokenURI(0));
  // await theme.evolve(5);
  // console.log("----------------------------");
  // console.log("tokenURI:", await NFT.tokenURI(5));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
