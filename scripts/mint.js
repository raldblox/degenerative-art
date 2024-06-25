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

  const token = await hre.ethers.getContractAt(
    "DegenerativesArt",
    "0x8c737d95d463607d781292F2A261C8528a05E341"
  );
  console.log("DegenerativesArt:", token.target);

  // currency
  const currency = await hre.ethers.getContractAt(
    "MoodToken",
    "0x3374fFc7Ab671894985961448c79844754057bB8"
  );
  console.log("currency:", currency.target);

  // pricer
  const pricer = await hre.ethers.getContractAt(
    "NFTPricer",
    "0x0ae1824C4e3e9806A36F1eb7E29b7d7Ae798bFbF"
  );
  console.log("pricer:", pricer.target);

  // update emoji
  const supply = await token.totalSupply();
  const currentPrice = await token.price(supply);
  await token.mint(mintEmojis[3], { value: currentPrice });

  // for (let i = 0; i < mintEmojis.length; i++) {
  //   const currentPrice = await token.price(i);
  //   console.log("minting", i);
  //   await token.mint(deployer.address, mintEmojis[i], { value: currentPrice });

  //   await new Promise((resolve) => setTimeout(resolve, 5000)); // Add 5-second delay
  // }

  //   console.log("tokenURI:", await token.tokenURI(2));
  // await theme.evolve(5);
  // console.log("----------------------------");
  // console.log("tokenURI:", await token.tokenURI(5));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
