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
  const [userStakedLP, setUserStakedLP] = useState(0); // Track staked LP
  const [userPendingRewards, setUserPendingRewards] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(0);

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
      const [totalSupply, balanceOf, stakedBalance] = await Promise.all([
        tachyLP.totalSupply(),
        tachyLP.balanceOf(userAddress),
        stakingContract.balanceOf(userAddress),
      ]);
      setTotalTachyLP(totalSupply);
      setUserLP(balanceOf);
      setUserStakedLP(stakedBalance);
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
    if (amountToStake.lte(0) || amountToStake.gt(userLP)) {
      alert("Invalid stake amount.");
      return;
    }

    try {
      setLoading(true);
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
      if (allowance.lt(amountToStake)) {
        const approveTx = await tachyLP.approve(
          stakingContractAddress,
          ethers.constants.MaxUint256
        );
        await approveTx.wait();
      }

      // Stake the LP tokens
      const stakeTx = await stakingContract.stake(amountToStake);
      await stakeTx.wait();

      toast({
        title: "Success",
        description: "LP tokens staked successfully!",
        type: "success",
      });

      fetchUserTokens(); // Refresh user token data
      setStakeAmount(0); // Reset stake amount input
    } catch (error) {
      console.error("Failed to stake:", error);
      toast({
        title: "Error",
        description: "Failed to stake LP tokens. Please try again later.",
        type: "error",
      });
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
          const pendingRewards = await stakingContract.calculateRewardsEarned(
            userAddress
          );
          setUserPendingRewards(pendingRewards);
        } catch (error) {
          console.error("Failed to fetch pending rewards:", error);
        }
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [userAddress]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-16 bg-zinc-100">
      <div className="absolute bottom-6 right-6">
        {loading && <Spinner size="sm" />}
      </div>
      {/* <div>
        <div>{parseFloat(ethers.formatEther(totalTachyLP)).toFixed(2)}</div>
      </div> */}
      <div className="grid content-between w-full max-w-sm p-6 space-y-4 bg-white animate-appearance-in drop-shadow-xl rounded-2xl">
        <div>
          <Tabs aria-label="Options" fullWidth radius="md" color="primary">
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
                  color="primary"
                  className="w-full text-white transition-all duration-300 bg-black "
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
                  color="primary"
                  className="w-full text-white transition-all duration-300 bg-black "
                >
                  Unstake
                </Button>
              </div>
            </Tab>
            <Tab key="claim" title="Claim">
              <div className="grid content-between min-h-[400px]">
                <div className="pt-32 space-y-4 text-center">
                  <h1 className="text-3xl font-semibold animate-appearance-in">
                    {parseFloat(ethers.formatEther(userPendingRewards)).toFixed(
                      2
                    )}{" "}
                    <span className="">MOOD</span>
                  </h1>
                  <p className="text-sm text-zinc-700">
                    Your unclaimed rewards
                  </p>
                </div>

                <Button
                  color="primary"
                  className="w-full text-white transition-all duration-300 bg-black "
                >
                  Claim Rewards
                </Button>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
