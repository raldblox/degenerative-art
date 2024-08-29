"use client";

import lstStakingAbi from "@/app/libraries/LPStakingABI.json";
import ERC20TokenABI from "@/app/libraries/ERC20TokenABI.json";
import { Context } from "@/app/providers/Providers";
import {
  Button,
  Card,
  CardBody,
  Input,
  Link,
  Spinner,
  Tab,
  Tabs,
} from "@nextui-org/react";

import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";

export default function LPStaking() {
  const { userAddress, setLoading, loading, signer } = useContext(Context);

  const [totalTachyLP, setTotalTachyLP] = useState(0);
  const [userLP, setUserLP] = useState(0);
  const [claimed, setClaimed] = useState(0);
  const [userStakedLP, setUserStakedLP] = useState(0); // Track staked LP
  const [userPendingRewards, setUserPendingRewards] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [selectedTab, setSelectedTab] = useState("stake");

  const stakingContractAddress = "0xc79F872f6be863b943bD2DF567541315278f8494";

  const fetchUserTokens = async () => {
    if (!userAddress) {
      return;
    }

    try {
      setLoading(true);
      const node = "https://node.mainnet.etherlink.com";
      const provider = new ethers.JsonRpcProvider(node);
      const tachyLP = new ethers.Contract(
        "0xC6D0AafDe70058EDA2E4F3DD17200dabD350A8D5",
        ERC20TokenABI,
        provider
      );
      const stakingContract = new ethers.Contract(
        "0xc79F872f6be863b943bD2DF567541315278f8494",
        lstStakingAbi,
        provider
      );
      const [
        totalSupply,
        balanceOf,
        stakedBalance,
        pendingRewards,
        earnedRewards,
        claimedRewards,
      ] = await Promise.all([
        tachyLP.totalSupply(),
        tachyLP.balanceOf(userAddress),
        stakingContract.balanceOf(userAddress),
        stakingContract.earned(userAddress),
        stakingContract.calculateRewardsEarned(userAddress),
        stakingContract.claimed(userAddress),
      ]);

      setUserPendingRewards(
        pendingRewards > earnedRewards ? pendingRewards : earnedRewards
      );
      if (pendingRewards > 0 || earnedRewards > 0) {
        setSelectedTab("claim");
      }
      setTotalTachyLP(totalSupply);
      setUserLP(balanceOf);
      setUserStakedLP(stakedBalance);
      setClaimed(claimedRewards);
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async () => {
    if (!signer || !userAddress) {
      alert("Please connect your wallet.");
      return;
    }

    const amountToStake = ethers.parseEther(stakeAmount.toString());
    if (amountToStake < 0 || amountToStake > userLP) {
      alert("Invalid stake amount.");
      return;
    }

    try {
      setLoading(true);

      const tachyLP = new ethers.Contract(
        "0xC6D0AafDe70058EDA2E4F3DD17200dabD350A8D5",
        ERC20TokenABI,
        signer
      );
      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        lstStakingAbi,
        signer
      );

      // Approve the staking contract to spend the LP tokens
      const allowance = await tachyLP.allowance(
        userAddress,
        stakingContractAddress
      );

      if (allowance < amountToStake) {
        const approveTx = await tachyLP.approve(
          stakingContractAddress,
          amountToStake
        );
        await approveTx.wait();
      }

      // Stake the LP tokens
      const stakeTx = await stakingContract.stake(amountToStake.toString());
      await stakeTx.wait();

      alert("LP tokens staked successfully!");

      fetchUserTokens(); // Refresh user token data
      setStakeAmount(0); // Reset stake amount input
    } catch (error) {
      console.error("Failed to stake:", error);
      alert("Failed to stake LP tokens. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!signer || !userAddress) {
      alert("Please connect your wallet.");
      return;
    }

    const amountToUnstake = ethers.parseEther(stakeAmount.toString());
    if (amountToUnstake < 0 || amountToUnstake > userStakedLP) {
      alert("Invalid unstake amount.");
      return;
    }

    try {
      setLoading(true);
      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        lstStakingAbi,
        signer
      );

      // Unstake the LP tokens
      const unstakeTx = await stakingContract.unstake(amountToUnstake);
      await unstakeTx.wait();

      alert("LP tokens unstaked successfully!");

      fetchUserTokens();
      setStakeAmount(0);
    } catch (error) {
      console.error("Failed to unstake:", error);
      alert("Failed to unstake LP tokens. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!signer || !userAddress) {
      alert("Please connect your wallet.");
      return;
    }

    try {
      setLoading(true);
      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        lstStakingAbi,
        signer
      );

      // Claim rewards
      const claimTx = await stakingContract.claim();
      await claimTx.wait();

      alert("Rewards claimed successfully!");
      fetchUserTokens();
    } catch (error) {
      console.error("Failed to claim rewards:", error);
      alert("Failed to claim rewards. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTokens();
    const intervalId = setInterval(async () => {
      if (userAddress) {
        try {
          const node = "https://node.mainnet.etherlink.com";
          const provider = new ethers.JsonRpcProvider(node);
          const stakingContract = new ethers.Contract(
            "0xc79F872f6be863b943bD2DF567541315278f8494",
            lstStakingAbi,
            provider
          );
          const pendingRewards = await stakingContract.earned(userAddress);
          const earnedRewards = await stakingContract.calculateRewardsEarned(
            userAddress
          );
          setUserPendingRewards(
            pendingRewards > earnedRewards ? pendingRewards : earnedRewards
          );
        } catch (error) {
          console.error("Failed to fetch pending rewards:", error);
        }
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [userAddress]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 md:p-16 bg-zinc-100">
      <Link href="/" className="absolute py-6 md:px-3 top-3">
        <svg
          className="h-8 text-black"
          viewBox="0 0 35 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30.1959 6.21804L20.7425 0.895891C19.7425 0.318403 18.413 0 16.9994 0C15.5861 0 14.2566 0.31802 13.2585 0.893978L3.92684 6.22187C1.76155 7.47099 0 10.36 0 12.6611V23.3131C0 25.6058 1.77341 28.494 3.95976 29.7554L13.4135 35.0775C14.4139 35.655 15.7433 35.9734 17.157 35.9734C18.5703 35.9734 19.8998 35.6554 20.8975 35.0794L30.2303 29.7516C32.3952 28.5021 34.1568 25.6138 34.1568 23.3131V12.6611C34.1564 10.3684 32.3826 7.47979 30.1959 6.21804ZM32.7029 23.3131C32.7029 25.0892 31.2081 27.5093 29.5066 28.4906L20.1738 33.8188C19.4019 34.2643 18.3021 34.5199 17.157 34.5199C16.0112 34.5199 14.9118 34.2643 14.1333 33.8146L4.67961 28.4925C2.9613 27.5009 1.45348 25.0804 1.45348 23.3131V12.6611C1.45348 10.885 2.94867 8.46409 4.65052 7.48286L13.9822 2.15458C14.7545 1.70912 15.8539 1.45348 16.9994 1.45348C18.1448 1.45348 19.2443 1.70912 20.0223 2.15879L29.476 7.48094C31.1951 8.47289 32.7029 10.8934 32.7029 12.6611V23.3131Z"
            fill="currentColor"
          />
          <path
            d="M16.9719 22.9528C16.1609 22.6975 15.3003 22.7741 14.5475 23.1679C12.9949 23.9788 12.3906 25.9026 13.2004 27.4568L14.0056 27.0373C13.4273 25.9271 13.8586 24.5521 14.9681 23.9731C16.0779 23.3929 17.4533 23.8254 18.0339 24.9359L18.8387 24.515C18.4449 23.7618 17.7824 23.2073 16.9719 22.9528Z"
            fill="currentColor"
          />
          <path
            d="M8.56216 18.8958C9.56568 18.8958 10.3792 18.0823 10.3792 17.0788C10.3792 16.0752 9.56568 15.2617 8.56216 15.2617C7.55863 15.2617 6.74512 16.0752 6.74512 17.0788C6.74512 18.0823 7.55863 18.8958 8.56216 18.8958Z"
            fill="currentColor"
          />
          <path
            d="M21.452 13.8322C19.772 15.5195 18.6288 16.5038 16.3973 15.5229L15.666 17.1857C16.5458 17.573 17.3296 17.7349 18.0372 17.7349C18.5707 17.7349 19.0594 17.6419 19.5125 17.4846C19.6966 18.2921 20.4157 18.8956 21.2798 18.8956C22.284 18.8956 23.0964 18.0828 23.0964 17.0786C23.0964 16.4471 22.7742 15.8918 22.2859 15.5665C22.4409 15.415 22.592 15.2635 22.7398 15.115C24.465 13.3821 25.6042 12.2367 28.3639 14.1869L29.4121 12.7028C25.4003 9.86858 23.2109 12.0664 21.452 13.8322Z"
            fill="currentColor"
          />
        </svg>
      </Link>
      <div className="absolute bottom-6 right-6">
        {loading && <Spinner size="sm" />}
      </div>

      {/* <div>
        <div>{parseFloat(ethers.formatEther(totalTachyLP)).toFixed(2)}</div>
      </div> */}
      <div className="grid content-between w-full max-w-sm p-3 space-y-4 bg-white md:p-6 animate-appearance-in drop-shadow-xl rounded-2xl">
        <div>
          <Tabs
            aria-label="Options"
            fullWidth
            radius="md"
            color="primary"
            selectedKey={selectedTab}
            onSelectionChange={setSelectedTab}
          >
            <Tab key="stake" title="Stake">
              <div className="grid content-between min-h-[400px]">
                <div className="pt-4 space-y-4">
                  <h1 className="text-xl font-semibold animate-appearance-in">
                    Earn More with LP Staking
                  </h1>
                  <p className="text-sm text-zinc-700">
                    Stake your LP tokens to earn additional MOOD rewards on top
                    of your trading fees.
                  </p>
                  <div className="flex items-center justify-between w-full pt-3">
                    <p className="text-sm">
                      <span className="text-zinc-600">Balance:</span>{" "}
                      <span className="font-semibold">
                        {parseFloat(ethers.formatEther(userLP)).toFixed(2)}
                      </span>
                    </p>
                    <div
                      className="text-sm cursor-pointer text-primary"
                      onClick={() => setStakeAmount(ethers.formatEther(userLP))}
                    >
                      Max
                    </div>
                  </div>
                  <Input
                    variant="bordered"
                    size="lg"
                    color="primary"
                    radius="md"
                    placeholder="0.00"
                    labelPlacement="inside"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    startContent={
                      <div className="flex items-center pointer-events-none">
                        <span className="text-default-400 text-small">QTY</span>
                      </div>
                    }
                    endContent={
                      <div className="flex items-center">
                        <label className="sr-only" htmlFor="currency">
                          Currency
                        </label>
                        <select
                          className="bg-transparent border-0 outline-none text-default-400 text-small"
                          id="currency"
                          name="currency"
                        >
                          <option>TACHY-LP</option>
                          <option disabled>DEGENART</option>
                          <option disabled>MOOD</option>
                        </select>
                      </div>
                    }
                    type="number"
                  />
                  <div className="flex items-center justify-center pt-4">
                    <Link
                      isExternal
                      href="https://app.tachyswap.org/#/add/0xd08B30c1EdA1284cD70E73F29ba27B5315aCc3F9/XTZ"
                      className="text-xs font-medium"
                    >
                      Get TACHY-LP by Providing Liquidity
                    </Link>
                  </div>
                </div>

                <Button
                  isLoading={loading}
                  color="primary"
                  className="w-full text-white transition-all duration-300 bg-black "
                  onClick={handleStake}
                >
                  Start Staking
                </Button>
              </div>
            </Tab>
            <Tab key="unstake" title="Unstake">
              <div className="grid content-between min-h-[400px]">
                <div className="pt-4 space-y-4">
                  <h1 className="text-xl font-semibold animate-appearance-in">
                    Unstake Your LP Tokens
                  </h1>
                  <p className="text-sm text-zinc-700">
                    Unstake your TACHY-LP tokens to withdraw them from the
                    staking pool.
                  </p>
                  <div className="flex items-center justify-between w-full pt-3">
                    <p className="text-sm">
                      <span className="text-zinc-600">Staked:</span>{" "}
                      <span className="font-semibold">
                        {parseFloat(ethers.formatEther(userStakedLP)).toFixed(
                          2
                        )}
                      </span>
                    </p>
                    <div
                      className="text-sm cursor-pointer text-primary"
                      onClick={() =>
                        setStakeAmount(ethers.formatEther(userStakedLP))
                      }
                    >
                      Max
                    </div>
                  </div>
                  <Input
                    variant="bordered"
                    size="lg"
                    color="primary"
                    radius="md"
                    placeholder="0.00"
                    labelPlacement="inside"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    startContent={
                      <div className="flex items-center pointer-events-none">
                        <span className="text-default-400 text-small">QTY</span>
                      </div>
                    }
                    endContent={
                      <div className="flex items-center">
                        <label className="sr-only" htmlFor="currency">
                          Currency
                        </label>
                        <select
                          className="bg-transparent border-0 outline-none text-default-400 text-small"
                          id="currency"
                          name="currency"
                        >
                          <option>TACHY-LP</option>
                          <option disabled>DEGENART</option>
                          <option disabled>MOOD</option>
                        </select>
                      </div>
                    }
                    type="number"
                  />
                </div>

                <Button
                  isLoading={loading}
                  onClick={handleUnstake}
                  color="primary"
                  className="w-full text-white transition-all duration-300 bg-black "
                >
                  Unstake
                </Button>
              </div>
            </Tab>
            <Tab key="claim" title="Claim">
              <div className="grid content-between min-h-[400px]">
                <div className="pt-16 text-center">
                  <h1 className="text-3xl font-semibold animate-appearance-in">
                    {parseFloat(ethers.formatEther(userPendingRewards)).toFixed(
                      4
                    )}{" "}
                    <span className="">MOOD</span>
                  </h1>
                  <p className="pb-6 text-sm text-zinc-700">
                    Your unclaimed rewards
                  </p>
                  <Button
                    isLoading={loading}
                    onClick={handleClaimRewards}
                    color="primary"
                    className="text-white transition-all duration-300 bg-black w-fit"
                  >
                    Claim Rewards
                  </Button>
                </div>
                <div className="grid content-start grid-cols-2">
                  <div className="leading-none text-center ">
                    <p className="text-xl font-semibold text-primary">
                      {parseFloat(ethers.formatEther(claimed)).toFixed(4)}
                    </p>
                    <span className="text-xs uppercase">
                      Claimed Rewards
                      <br />
                      (MOOD)
                    </span>
                  </div>
                  <div className="leading-none text-center">
                    <p className="text-xl font-semibold text-primary">0.025</p>
                    <span className="text-xs uppercase">
                      DAILY REWARD RATE <br />
                      (MOOD/TACHY-LP)
                    </span>
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
