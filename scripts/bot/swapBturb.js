const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const networkName = network.name;
  console.log("Deployer:", deployer.address, "|", networkName);

  const swap = await hre.ethers.getContractAt(
    "SwapBTURB",
    "0x6b0795d6581edaC44eA633E6Ce88B132a9D450B4"
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

      if (wethAllowance < WETHBalance) {
        console.log("Approving WETH...");
        const approveTx = await WETH.approve(swap.target, WETHBalance);
        await approveTx.wait();
        console.log("WETH approved.");
      }

      const bturbAllowance = await BTURB.allowance(
        deployer.address,
        swap.target
      );

      if (bturbAllowance < BTURBBalance) {
        console.log("Approving BTURB...");
        const approveTx = await BTURB.approve(swap.target, BTURBBalance);
        await approveTx.wait();
        console.log("BTURB approved.");
      }

      if (BTURBBalance > 0) {
        try {
          await swap.sell(BTURBBalance);
          console.log("Sell success");
        } catch (error) {
          console.error("Error selling:", error);
        }
      }

      if (WETHBalance > 0) {
        try {
          await swap.buy(WETHBalance);
          console.log("Buy success");
        } catch (error) {
          console.error("Error buying:", error);
        }
      }
    } finally {
      setTimeout(autoBuyAndSell, 5000);
    }
  }

  autoBuyAndSell();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
