"use client";

import { useContext, useEffect, useState } from "react";
import { Button, Image, Link, Tab, Tabs, Tooltip } from "@nextui-org/react";
import { FlipWords } from "./components/FlipWords";
import { EmojiGlass } from "./components/EmojiGlass";
import { Navigation } from "./components/Navigation";
import { Context } from "./providers/Providers";
import MintToken from "./components/MintToken";
import { ethers } from "ethers";
import LivePriceChart from "./components/PriceCharts";
import { AssetLoader } from "./components/AssetLoader";
import AllFeels from "./components/AllFeels";
import UpdateToken from "./components/UpdateToken";
import { MyFeels } from "./components/MyFeels";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const {
    mintPrice,
    instance,
    signer,
    fetching,
    switchNetwork,
    allAssets,
    userAddress,
    selectedTab,
    setSelectedTab,
    connectEthereumWallet,
  } = useContext(Context);

  const [shuffledContent, setShuffledContent] = useState({
    headline: [
      "Mint Your Mood Before It's Gone, Ser 🫡",
      "Yo, Immortalize Your Feels 🤝",
      "Don't Let Your Mood Go to Waste fam 🗑️",
      "Your Emotional State, Tokenized (It's Art, I Swear on Vitalik 🙏)",
      "Feeling Froggy? 🐸 Mint Your Mood into generative art",
      "This is the Way to Express Your Vibes ✨",
      "Turn Your Feels into NFTs, You Absolute Chad 😎",
      "Diamond Hands or Paper Hands? 🤔 Let Your Emojis Decide! 😜",
    ],
    label: [
      "One-Time Mood Check. 3-9 Emojis Only, No BS 🧢",
      "The Universe (and the Blockchain) Need Your Emojis. 3-9, Plz 🙏",
      "Seriously Though, Drop 3-9 Emojis That Sum Up Your Whole Existence rn",
      "One-Time Vibe Check. 3-9 Emojis. No Take Backsies 🙅",
      "Drop Your Emojis, fam. The Blockchain is Listening. 🎧  (3-9 max)",
      "GM/GN? Doesn't Matter. Drop Your Emojis Here 🫡",
      "Wen Mint? Now! Drop 3-9 Emojis and Let's Go 🚀",
      "No Fud, Just Vibes. 3-9 Emojis Only 😎",
      "This Ain't No Shitcoin, This is Art 🎨 (3-9 Emojis pls)",
      "Your Mood, Our Algorithm. Let's Make Some Magic ✨",
    ],
    placeholders: ["🤒", "🤪", "🤕", "😠", "😭", "😂", "😎", "🚀", "🔥"],
  });

  // const [isOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   // Open the modal after 1.5 seconds
  //   const openTimeoutId = setTimeout(() => {
  //     setIsOpen(true);

  //     // Close the modal after another 1.5 seconds
  //     const closeTimeoutId = setTimeout(() => {
  //       setIsOpen(false);
  //     }, 1500);

  //     // Clean up the close timeout if the component unmounts
  //     return () => clearTimeout(closeTimeoutId);
  //   }, 1500);

  //   // Clean up the open timeout if the component unmounts
  //   return () => clearTimeout(openTimeoutId);
  // }, []);

  useEffect(() => {
    setShuffledContent({
      headline: shuffleArray([...shuffledContent.headline]),
      label: shuffleArray([...shuffledContent.label]),
      placeholders: shuffleArray([...shuffledContent.placeholders]),
    });
    setMounted(true);
  }, [selectedTab]);

  return (
    <>
      <Navigation
        tabs={
          <Tabs
            size="sm"
            className=""
            classNames={{
              tabList: "border-small gap-1 bg-default-100",
            }}
            variant="bordered"
            radius="full"
            color="primary"
            aria-label="Tabs"
            selectedKey={selectedTab}
            onSelectionChange={setSelectedTab}
          >
            <Tab key="home" title="Home" />
            <Tab key="explore" title="Explore" />
            {userAddress && (
              <Tab key="feels" className="text-bold" title="My Feels" />
            )}
          </Tabs>
        }
      />
      {mounted && (
        <>
          {selectedTab == "home" && (
            <section className="relative min-h-screen md:mx-8" id="start">
              <div className="flex relative flex-col space-y-8 items-center min-h-[550px] justify-center w-full h-full p-6 md:p-12 bg-gradient-to-tr from-zinc-200/50 via-transparent to-zinc-200/50 rounded-3xl">
                <span className="p-1 px-4 text-center lowercase bg-white rounded-full shadow-md text-tiny text-balance border-small">
                  Where Emotions Become Art 🎨 and Currency 🪙
                </span>
                <h1 className="max-w-2xl text-3xl font-semibold text-center lowercase text-balance md:text-4xl animate-appearance-in">
                  {shuffledContent.headline[0]}
                </h1>
                <p className="max-w-2xl text-[10px] md:text-sm text-center text-pretty">
                  Your feelings change — your art should too. With
                  degeneratives.art, your emotions aren&apos;t static. They
                  evolve, transform, and create value. Your mood swing finally
                  found a match.
                </p>
                <div className="flex flex-col items-center justify-center gap-2 transition-all duration-300">
                  <div className="flex flex-wrap items-center gap-3">
                    <MintToken />
                    {userAddress && (
                      <Button
                        fullWidth
                        size="md"
                        radius="full"
                        variant="solid"
                        color="primary"
                        className="transition-all duration-300 w-fit"
                        onClick={() => setSelectedTab("feels")}
                      >
                        My Feels
                      </Button>
                    )}
                  </div>

                  {mintPrice > 0 && (
                    <>
                      <span
                        className={`py-4 font-semibold transition-all duration-500 ${
                          fetching
                            ? "animate-pulse text-blue-700 scale-80 tracking-widest"
                            : "animate-appearance-in text-zinc-700 "
                        }`}
                      >
                        MINT PRICE: ~{ethers.formatEther(mintPrice)} $XTZ
                      </span>
                      <Link
                        href="#chart"
                        size="sm"
                        className="animate-appearance-in"
                      >
                        [simulate mint price]
                      </Link>
                    </>
                  )}

                  <div className="pt-12">
                    <Button
                      className="uppercase"
                      size="sm"
                      radius="none"
                      variant="light"
                      href="https://x.com/_degeneratives"
                      isExternal
                      as={Link}
                      showAnchorIcon
                    >
                      Engage on X/Twitter
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 ">
                  <Tooltip
                    closeDelay={2000}
                    showArrow
                    color="success"
                    placement="left"
                    content={
                      <div className="px-1 py-2 space-y-2 text-center">
                        <div className="font-bold text-small">
                          etherlink.com
                        </div>
                        <div className="flex flex-col gap-2 text-tiny">
                          <Button size="sm" onClick={switchNetwork}>
                            Add/Switch to Etherlink Network
                          </Button>
                          <Button
                            size="sm"
                            onClick={switchNetwork}
                            as={Link}
                            href="https://docs.etherlink.com/building-on-etherlink/bridging/"
                          >
                            Bridge XTZ from Tezos L1 to Etherlink
                          </Button>
                          <Button
                            size="sm"
                            as={Link}
                            isExternal
                            href="https://explorer.etherlink.com/token/0xa3c4e2C4772B879FD82Dd9a6735B4ee8a600B54F"
                          >
                            View all degeneratives.art NFTs
                          </Button>
                        </div>
                      </div>
                    }
                  >
                    <div className="md:absolute grid animate-appearance-in top-[15%] left-[7%]">
                      <Image src="./etherlink.svg" height={20} width={90} />
                      <span className="text-[10px] pl-6 text-default-500">
                        Blockchain Network
                      </span>
                    </div>
                  </Tooltip>
                  <Tooltip
                    closeDelay={2000}
                    showArrow
                    color="default"
                    placement="left"
                    content={
                      <div className="px-1 py-2 space-y-2 text-center">
                        <div className="font-bold text-small">
                          onchainsupply.net
                        </div>
                        <div className="text-tiny">
                          <Button
                            size="sm"
                            className="text-tiny"
                            as={Link}
                            href="https://onchainsupply.net"
                            isExternal
                          >
                            Create Smart Assets
                          </Button>
                        </div>
                      </div>
                    }
                  >
                    <div className="md:absolute grid animate-appearance-in top-[43%] left-[4%]">
                      <div className="flex items-center gap-2">
                        <Image
                          src="./onchainsupply.png"
                          height={20}
                          width={20}
                          radius="md"
                        />
                        <p className="text-sm font-bold">OnChainSupply</p>
                      </div>

                      <span className="text-[10px] pl-6 text-default-500">
                        NFT Supplier
                      </span>
                    </div>
                  </Tooltip>
                  <Tooltip
                    closeDelay={2000}
                    showArrow
                    color="success"
                    placement="left"
                    content={
                      <div className="px-1 py-2 space-y-2 text-center">
                        <div className="font-bold text-small">
                          degenerator.wtf
                        </div>
                        <div className="text-tiny">
                          <Button
                            size="sm"
                            className="text-tiny"
                            as={Link}
                            isExternal
                            href="https://www.degenerator.wtf/"
                          >
                            Launch Token
                          </Button>
                        </div>
                      </div>
                    }
                  >
                    <div className="md:absolute grid animate-appearance-in top-[43%] right-[4%]">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/degenerator.jpg"
                          radius="full"
                          height={20}
                          width={20}
                        />

                        <p className="text-sm font-bold">Degenerator</p>
                      </div>
                      <span className="text-[10px] pl-6 text-default-500">
                        ERC20 Deployer
                      </span>
                    </div>
                  </Tooltip>
                  <Tooltip
                    closeDelay={2000}
                    showArrow
                    color="secondary"
                    placement="left"
                    content={
                      <div className="px-1 py-2 space-y-2 text-center">
                        <div className="font-bold text-small">
                          geckoterminal.com
                        </div>
                        <div className="text-tiny">
                          <Button
                            size="sm"
                            className="text-tiny"
                            as={Link}
                            isExternal
                            href="https://www.geckoterminal.com/etherlink/pools/0xc6d0aafde70058eda2e4f3dd17200dabd350a8d5"
                          >
                            MOOD/XTZ Chart
                          </Button>
                        </div>
                      </div>
                    }
                  >
                    <div className="md:absolute grid animate-appearance-in top-[70%] right-[7%] ">
                      <Image src="/geckoterminal.svg" height={20} width={120} />
                      <span className="text-[10px] pl-6 text-default-500">
                        Charts & DEX Tools
                      </span>
                    </div>
                  </Tooltip>
                  <Tooltip
                    closeDelay={2000}
                    showArrow
                    color="warning"
                    placement="right"
                    content={
                      <div className="px-1 py-2 space-y-2 text-center">
                        <div className="font-bold text-small">rarible.com</div>
                        <div className="text-tiny">
                          <Button
                            size="sm"
                            className="text-tiny"
                            as={Link}
                            href="https://rarible.com/degeneratives"
                            isExternal
                          >
                            Buy/Sell Degeneratives
                          </Button>
                        </div>
                      </div>
                    }
                  >
                    <div className="md:absolute grid animate-appearance-in top-[70%] left-[7%]">
                      <Image
                        src="/rarible.svg"
                        height={20}
                        width={75}
                        radius="none"
                      />
                      <span className="text-[10px] pl-6 text-default-500">
                        NFT Marketplace
                      </span>
                    </div>
                  </Tooltip>
                  <Tooltip
                    closeDelay={2000}
                    showArrow
                    color="primary"
                    placement="left"
                    content={
                      <div className="px-1 py-2 space-y-2 text-center">
                        <div className="font-bold text-small">
                          tachyswap.org
                        </div>
                        <div className="text-tiny">
                          <Button
                            size="sm"
                            className="text-tiny"
                            as={Link}
                            isExternal
                            href="https://app.tachyswap.org/#/swap?outputCurrency=0xd08b30c1eda1284cd70e73f29ba27b5315acc3f9"
                          >
                            Swap MOOD/XTZ
                          </Button>
                        </div>
                      </div>
                    }
                  >
                    <div className="md:absolute grid animate-appearance-in top-[15%] right-[10%]">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/tachyswap.png"
                          height={20}
                          width={20}
                          radius="none"
                        />
                        <p className="text-sm font-bold">TachySwap</p>
                      </div>

                      <span className="text-[10px] pl-6 text-default-500">
                        DEX/LP Provider
                      </span>
                    </div>
                  </Tooltip>
                </div>
              </div>

              <div
                id="mint"
                className="grid w-full h-full p-12 md:p-16 bg-gradient-to-tr from-default-200/50 via-transparent to-default-200/50 rounded-3xl"
              >
                <div className="mx-auto text-3xl font-normal tracking-tighter text-pretty">
                  let&apos;s put your emotions <br className="md:hidden" /> to{" "}
                  <FlipWords
                    words={[
                      "play",
                      "stake",
                      "work",
                      "canvas",
                      "shape",
                      "flow",
                      "euphoria",
                    ]}
                  />
                </div>
              </div>

              <div className="grid gap-4 p-4 md:gap-6 md:p-16 md:grid-cols-3 bg-gradient-to-tr from-default-200/50 via-transparent to-default-200/50 rounded-3xl">
                <div className="flex h-full p-8 space-x-3 duration-200 cursor-pointer group text-pretty bg-gradient-to-tr from-zinc-200/50 via-transparent to-zinc-200/50 hover:shadow-md rounded-2xl">
                  <div className="relative flex w-16 h-16 rounded-full aspect-square group">
                    <EmojiGlass emoji="🍬" />
                  </div>
                  <div className="grid content-between h-full space-y-3">
                    <div className="h-full space-y-3">
                      <h1 className="px-3 text-2xl font-medium">
                        <span className="">mint</span>
                      </h1>
                      <p className="px-3 text-xs">
                        express your unique emotions to mint degenerative.art
                      </p>
                    </div>
                    <div className="flex w-full p-3">
                      <Button
                        variant="flat"
                        radius="full"
                        size="sm"
                        onClick={() => {
                          window.scrollTo(0, 0);
                        }}
                        className="hover:bg-black hover:text-white"
                      >
                        now minting
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex h-full p-8 space-x-3 duration-200 cursor-pointer group text-pretty bg-gradient-to-tr from-zinc-200/50 via-transparent to-zinc-200/50 hover:shadow-md rounded-2xl">
                  <div className="relative flex w-16 h-16 rounded-full aspect-square group">
                    <EmojiGlass emoji="🎨" />
                  </div>
                  <div className="grid content-between h-full space-y-3">
                    <div className="h-full space-y-3">
                      <h1 className="px-3 text-2xl font-medium">
                        img2emoji.art
                      </h1>
                      <p className="px-3 text-xs">
                        generate art from image with emojis as pixels
                      </p>
                    </div>
                    <div className="flex w-full p-3">
                      <Button
                        variant="flat"
                        radius="full"
                        size="sm"
                        as={Link}
                        className="hover:bg-black hover:text-white"
                        href="/tool/img2emoji.art"
                      >
                        now servicing
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex h-full p-8 space-x-3 duration-200 cursor-pointer group text-pretty bg-gradient-to-tr from-zinc-200/50 via-transparent to-zinc-200/50 hover:shadow-md rounded-2xl">
                  <div className="relative flex w-16 h-16 rounded-full aspect-square group">
                    <EmojiGlass emoji="🥩" />
                  </div>
                  <div className="grid content-between h-full space-y-3">
                    <div className="h-full space-y-3">
                      <h1 className="px-3 text-2xl font-medium">stake</h1>
                      <p className="px-3 text-xs">
                        stake your degenart to earn some $MOOD tokens
                      </p>
                    </div>
                    <div className="flex w-full p-3">
                      <Button variant="flat" radius="full" size="sm">
                        staking soon
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex h-full p-8 space-x-3 duration-200 cursor-pointer group text-pretty bg-gradient-to-tr from-zinc-200/50 via-transparent to-zinc-200/50 hover:shadow-md rounded-2xl">
                  <div className="relative flex w-16 h-16 rounded-full aspect-square group">
                    <EmojiGlass emoji="🏊‍♂️" />
                  </div>
                  <div className="grid content-between h-full space-y-3">
                    <div className="h-full space-y-3">
                      <h1 className="px-3 text-2xl font-medium">pool</h1>
                      <p className="px-3 text-xs">
                        provide liquidity to earn fees and rewards
                      </p>
                    </div>
                    <div className="flex w-full p-3">
                      <Button variant="flat" radius="full" size="sm">
                        coming soon
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex h-full p-8 space-x-3 duration-200 cursor-pointer group text-pretty bg-gradient-to-tr from-zinc-200/50 via-transparent to-zinc-200/50 hover:shadow-md rounded-2xl">
                  <div className="relative flex w-16 h-16 rounded-full aspect-square group">
                    <EmojiGlass emoji="🧬" />
                  </div>
                  <div className="grid content-between h-full space-y-3">
                    <div className="h-full space-y-3">
                      <h1 className="px-3 text-2xl font-medium">evolve</h1>
                      <p className="px-3 text-xs">
                        update your feels to evolve your staking power
                      </p>
                    </div>
                    <div className="flex w-full p-3">
                      <Button variant="flat" radius="full" size="sm">
                        evolving soon
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex h-full p-8 space-x-3 duration-200 cursor-pointer group text-pretty bg-gradient-to-tr from-zinc-200/50 via-transparent to-zinc-200/50 hover:shadow-md rounded-2xl">
                  <div className="relative flex w-16 h-16 rounded-full aspect-square group">
                    <EmojiGlass emoji="🎲" />
                  </div>
                  <div className="grid content-between h-full space-y-3">
                    <div className="h-full space-y-3">
                      <h1 className="px-3 text-2xl font-medium">play</h1>
                      <p className="px-3 text-xs">
                        bored as f*ck? play emoji-based onchain games
                      </p>
                    </div>
                    <div className="flex w-full p-3">
                      <Button variant="flat" radius="full" size="sm">
                        coming soon
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex h-full p-8 space-x-3 duration-200 cursor-pointer group text-pretty bg-gradient-to-tr from-zinc-200/50 via-transparent to-zinc-200/50 hover:shadow-md rounded-2xl">
                  <div className="relative flex w-16 h-16 rounded-full aspect-square group">
                    <EmojiGlass emoji="🎰" />
                  </div>
                  <div className="grid content-between h-full space-y-3">
                    <div className="h-full space-y-3">
                      <h1 className="px-3 text-2xl font-medium">win</h1>
                      <p className="px-3 text-xs">
                        collect scratch cards and win awesome prizes
                      </p>
                    </div>
                    <div className="flex w-full p-3">
                      <Button variant="flat" radius="full" size="sm">
                        coming soon
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex h-full p-8 space-x-3 duration-200 cursor-pointer group text-pretty bg-gradient-to-tr from-zinc-200/50 via-transparent to-zinc-200/50 hover:shadow-md rounded-2xl">
                  <div className="relative flex w-16 h-16 rounded-full aspect-square group">
                    <EmojiGlass emoji="🌉" />
                  </div>
                  <div className="grid content-between h-full space-y-3">
                    <div className="h-full space-y-3">
                      <h1 className="px-3 text-2xl font-medium">bridge</h1>
                      <p className="px-3 text-xs">
                        bridge your tokens to other blockchains
                      </p>
                    </div>
                    <div className="flex w-full p-3">
                      <Button variant="flat" radius="full" size="sm">
                        coming soon
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="chart"
                className="flex flex-col items-center justify-center gap-4 p-4 mx-auto mb-6 md:gap-6 md:p-16 bg-gradient-to-tr from-default-200/50 via-transparent to-default-200/50 rounded-3xl"
              >
                <h1 className="text-lg">PRICE CURVE & SUPPLY DYNAMICS</h1>
                <LivePriceChart />
                <p className="max-w-4xl text-xs">
                  This pricing model is designed to create a fair and
                  sustainable ecosystem for degeneratives.art. There&apos;s no
                  cap on the number of NFTs that can be minted, but the
                  exponential price curve acts as a natural limiting factor. The
                  more NFTs that exist, the higher the price becomes for the
                  next one.
                </p>
              </div>
            </section>
          )}
          {selectedTab == "explore" && (
            <>
              <section className="min-h-screen">
                <div className="flex flex-col items-center justify-center w-full p-3 md:p-16">
                  <h1 className="max-w-3xl text-4xl text-center lowercase text-pretty">
                    Discover what other homies are feeling lately
                  </h1>
                  <div className="flex flex-col items-center justify-center mt-16">
                    <AllFeels />
                  </div>
                </div>
              </section>
            </>
          )}
          {selectedTab == "feels" && (
            <>
              <section className="min-h-screen">
                <div className="flex flex-col items-center justify-center w-full p-3 md:p-16">
                  <h1 className="max-w-3xl text-4xl text-center lowercase text-pretty">
                    all your minted feels onchain
                  </h1>
                  <div className="flex flex-col items-center justify-center mt-16">
                    <MyFeels />
                  </div>
                </div>
              </section>
            </>
          )}
        </>
      )}
    </>
  );
}
