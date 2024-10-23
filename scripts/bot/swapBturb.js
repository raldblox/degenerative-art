const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const networkName = network.name;
  console.log("Deployer:", deployer.address, "|", networkName);

  const swap = await hre.ethers.getContractAt(
    "SwapBTURB",
    "0x04f92FF670AAD20D8b1EF7634754fc7666fed0Db"
  );

  console.log("BTURB Swap:", swap.target);

  const WETH = await hre.ethers.getContractAt(
    "ERC20",
    "0x4200000000000000000000000000000000000006"
  );

  const BTURB = await hre.ethers.getContractAt(
    "ERC20",
    "0x113E67720A24EC1Ae8fcB5F7c18A0C3B27aBF1A6"
  );

  async function autoBuyAndSell() {
    try {
      const WETHBalance = await WETH.balanceOf(deployer.address);
      const BTURBBalance = await BTURB.balanceOf(deployer.address);
      console.log(
        `WETHBalance: ${WETHBalance} | BTURBBalance: ${BTURBBalance}`
      );

      const wethAllowance = await WETH.allowance(deployer.address, swap.target);
      const bturbAllowance = await BTURB.allowance(
        deployer.address,
        swap.target
      );

      console.log(
        `wethAllowance: ${wethAllowance} | bturbAllowance: ${bturbAllowance}`
      );

      if (BTURBBalance > 0) {
        if (bturbAllowance < BTURBBalance) {
          console.log("Approving BTURB...");
          const approveTx = await BTURB.approve(swap.target, BTURBBalance);
          await approveTx.wait();
          console.log("BTURB approved.");
        }

        try {
          await swap.sell(BTURBBalance);
          console.log("Sell success");
        } catch (error) {
          console.error("Error selling:", error);
        }
      }

      if (WETHBalance > 0) {
        if (wethAllowance < WETHBalance) {
          console.log("Approving WETH...");
          const approveTx = await WETH.approve(swap.target, WETHBalance);
          await approveTx.wait();
          console.log("WETH approved.");
        }
        try {
          await swap.buy(WETHBalance);
          console.log("Buy success");
        } catch (error) {
          console.error("Error buying:", error);
        }
      }
    } finally {
      setTimeout(autoBuyAndSell, 10000);
    }
  }

  autoBuyAndSell();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
