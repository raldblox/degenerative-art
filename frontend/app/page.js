"use client";

import {
  Button,
  ButtonGroup,
  Chip,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Spinner,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useContext, useEffect, useRef, useState } from "react";
import LivePriceChart, { calculateMintPrice } from "./(components)/PriceCharts";
import EmojisContainer from "./(components)/EmojisContainer";
import { Context } from "./(providers)/EthereumProvider";
import { Navigation } from "./(components)/Navigation";
import { EmojiGlass } from "./(components)/EmojiGlass";
import { FlipWords } from "./(components)/FlipWords";
import tokenAbi from "@/app/(libraries)/DegenerativesArt.json";
import { ethers } from "ethers";
import { AssetLoader } from "./(components)/loader/AssetLoader";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function MintModal({ isOpen, onOpen, onOpenChange }) {
  const {
    connectEthereumProvider,
    userAddress,
    countdown,
    timeUpdated,
    instances,
    mint,
    minting,
  } = useContext(Context);
  const fieldsRef = useRef(null);
  const maxFields = 9;
  const inputRef = useRef([]);
  const [inputValues, setInputValues] = useState(Array(maxFields).fill(""));
  const [activeFields, setActiveFields] = useState(3);

  const handleMint = async () => {
    if (inputValues.length >= 3) {
      await mint(inputValues);
    }
  };

  const handleChange = (event, index) => {
    const value = event.target.value; // Get the last entered character
    // Log the actual value and its Unicode code point
    console.log(`New value: ${value}`);
    setInputValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });

    if (index < activeFields - 1 && value.length > 0) {
      // Focus on next input if current input is filled and there are more inputs
      inputRef.current[index + 1].focus();
    } else if (
      index === activeFields - 1 &&
      value.length > 0 &&
      activeFields < maxFields
    ) {
      // Add new input if current input is filled and there are less than 9 inputs
      setActiveFields(activeFields + 1);
      inputRef.current[index + 1].focus(); // Focus on new input
    }
  };

  const handleKeyUp = (event, index) => {
    if (
      (event.key === "Delete" || event.key === "Backspace") &&
      inputValues[index] === ""
    ) {
      if (index > 0) {
        inputRef.current[index - 1].focus();
      }
      if (activeFields > 3) {
        setActiveFields(activeFields - 1);
      }
    }
  };

  const renderInputFields = () => {
    const inputFields = [];
    for (let i = 0; i < maxFields; i++) {
      inputFields.push(
        <input
          data-emoji-input="unicode"
          key={i}
          size="lg"
          type="text"
          data-index={i}
          ref={(el) => (inputRef.current[i] = el)}
          className={`w-12 h-12 placeholder:saturate-0 text-2xl text-center rounded-lg border-3 border-black outline-none focus:border-indigo-600 ${
            i >= activeFields ? "hidden" : ""
          }`}
          onChange={(e) => {
            const value = e.target.value;
            const emoji = value.match(/[\p{Emoji}]/u);
            if (emoji) {
              e.target.value = emoji[0];
            } else {
              e.target.value = "";
            }
            handleChange(e, i);
          }}
          onKeyUp={(e) => handleKeyUp(e, i)}
        />
      );
    }
    return inputFields;
  };

  useEffect(() => {
    if (!fieldsRef.current) {
      return;
    }
    const elements = fieldsRef.current.children;
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = i < activeFields ? "block" : "none";
    }

    if (activeFields > 3 && inputRef.current[activeFields - 1]) {
      inputRef.current[activeFields - 1].focus();
    }
  }, [activeFields]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="xl"
      className="pt-6 pb-3 md:p-16"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <label className="text-xl font-semibold tracking-tight text-center lowercase text-balance md:text-2xl">
                Enter the one-time emoji mood that universe gave you today
              </label>
            </ModalHeader>
            <ModalBody>
              {/* <p className="mt-4 text-xs text-center lowercase md:text-sm">
                Don&apos;t worry if your cosmic vibes change tomorrow... your
                NFT is always listening and so well-prepared to evolve alongside
                you! We&apos;ll provide you $MOOD token after nft mint to fuel
                your daily mood swings for the next hundred years! Your
                ever-changing feelings have finally found a match.
              </p> */}
              {countdown !== "00:00:00" && (
                <p className="mx-auto text-lg font-semibold">{countdown}</p>
              )}

              <div className="flex flex-col items-center justify-center pb-6 space-y-4">
                <div
                  ref={fieldsRef}
                  className="flex flex-wrap items-center justify-center gap-2 p-4 rounded-lg bg-white/80"
                >
                  {renderInputFields()}
                </div>
                <label className="text-sm">(enter 3-9 emojis only)</label>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-center w-full gap-2">
              {userAddress ? (
                <Button
                  startContent={
                    <svg
                      className="h-5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M17 9V7A5 5 0 0 0 7 7v2a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3M9 7a3 3 0 0 1 6 0v2H9Zm9 12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1Z"
                      />
                    </svg>
                  }
                  size="lg"
                  radius="full"
                  variant="flat"
                  className="text-white bg-black"
                  onClick={handleMint}
                  isLoading={minting}
                  isDisabled
                >
                  minting soon 🪄
                </Button>
              ) : (
                <Button
                  color="primary"
                  radius="full"
                  variant="solid"
                  fullWidth
                  size="lg"
                  onClick={connectEthereumProvider}
                >
                  connect wallet
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default function Home() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { signer, setNetwork, allAssets, fetching } = useContext(Context);

  const [mounted, setMounted] = useState(false);
  const [supplies, setSupplies] = useState(null);
  const [selectedTab, setSelectedTab] = useState("home");

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

  useEffect(() => {
    setShuffledContent({
      headline: shuffleArray([...shuffledContent.headline]),
      label: shuffleArray([...shuffledContent.label]),
      placeholders: shuffleArray([...shuffledContent.placeholders]),
    });
    setMounted(true);
  }, []);

  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const fetchHtml = async () => {
      if (fetching) {
        return;
      }

      try {
        const response = await fetch("./render.html");
        const data = await response.text();
        setHtmlContent(data);
        const protocol =
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://www.degeneratives.art";
        const url = `${protocol}/api/getInfo`;
        const supplies = await fetch(url).then((res) => res.json());
        setSupplies(supplies.results);
        console.log("supplies", supplies.results);

        // Loop through each network and supply
        // const allEmojis = {};
        // for (const item of supplies.results) {
        //   const network = item.network;
        //   const supply = item.supply;

        //   for (let index = 0; index < supply; index++) {
        //     const emojiUrl = `${protocol}/api/getEmojis/${network}/${index}`;
        //     const emoji = await fetch(emojiUrl).then((res) => res.json());
        //     allEmojis[network] = {
        //       supply,
        //       emojis: emoji,
        //     };
        //   }
        // }
      } catch (error) {
        console.error("Error fetching HTML:", error);
      }
    };

    fetchHtml();
  }, [selectedTab]);

  return (
    <>
      {mounted && (
        <main className="w-full min-h-screen">
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
                <Tab key="analytics" title="Analytics" />
                <Tab key="feels" className="text-bold" title="All Feels" />
              </Tabs>
            }
            mint={
              <Button
                size="sm"
                color="foreground"
                variant="bordered"
                radius="full"
                className="font-bold border-small bg-default-100"
                onPress={onOpen}
              >
                mint
              </Button>
            }
          />
          {selectedTab == "home" && (
            <>
              <section className="relative min-h-screen md:mx-12">
                <div className="flex relative flex-col space-y-8 items-center min-h-[70vh] justify-center w-full h-full p-12 bg-gradient-to-tr from-zinc-200/50 via-transparent to-zinc-200/50 rounded-3xl">
                  <span className="p-1 px-4 text-center lowercase rounded-full bg-default-100 text-tiny text-balance border-small">
                    Where Emotions Become Art 🎨 and Currency 🪙
                  </span>
                  <h1 className="max-w-4xl text-3xl font-semibold text-center lowercase text-balance md:text-5xl animate-appearance-in">
                    {shuffledContent.headline[0]}
                  </h1>
                  <p className="max-w-2xl text-[10px] md:text-sm text-center text-pretty">
                    {" "}
                    Your feelings change — your art should too. With
                    degeneratives.art, your emotions aren&apos;t static. They
                    evolve, transform, and create value. Your mood swing finally
                    found a match.
                  </p>
                  <div className="flex gap-2 ">
                    <Button
                      fullWidth
                      // as={Link}
                      // href="#mint"
                      size="sm"
                      radius="full"
                      variant="solid"
                      color="default"
                      onPress={onOpen}
                    >
                      Mint your Feels
                    </Button>
                    <Button
                      fullWidth
                      size="sm"
                      radius="full"
                      variant="flat"
                      className="text-white bg-black"
                      onClick={() => setSelectedTab("feels")}
                    >
                      Discover Feels
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Tooltip
                      shouldFlip
                      showArrow
                      color="secondary"
                      placement="right"
                      content={
                        <div className="px-1 py-2 space-y-2 text-center">
                          <div className="font-bold text-small">
                            polygon.technology
                          </div>
                          <div className="text-tiny">
                            <Button
                              size="sm"
                              className="text-tiny"
                              onClick={(e) => setNetwork("polygon")}
                            >
                              switch to this network
                            </Button>
                          </div>
                        </div>
                      }
                    >
                      <div className="md:absolute grid animate-appearance-in top-[15%] left-[10%]">
                        <Chip
                          className="border-none"
                          variant="dot"
                          color="secondary"
                        >
                          Polygon
                        </Chip>
                        <span className="text-[10px] pl-6 text-default-500">
                          0x89
                        </span>
                      </div>
                    </Tooltip>
                    <Tooltip
                      shouldFlip
                      showArrow
                      color="primary"
                      placement="left"
                      content={
                        <div className="px-1 py-2 space-y-2 text-center">
                          <div className="font-bold text-small">base.org</div>
                          <div className="text-tiny">
                            <Button
                              size="sm"
                              className="text-tiny"
                              onClick={(e) => setNetwork("base")}
                            >
                              switch to this network
                            </Button>
                          </div>
                        </div>
                      }
                    >
                      <div className="md:absolute grid animate-appearance-in top-[15%] right-[10%]">
                        <Chip
                          className="border-none"
                          variant="dot"
                          color="primary"
                        >
                          Base
                        </Chip>
                        <span className="text-[10px] pl-6 text-default-500">
                          0x2105
                        </span>
                      </div>
                    </Tooltip>
                    <Tooltip
                      shouldFlip
                      showArrow
                      color="warning"
                      placement="left"
                      content={
                        <div className="px-1 py-2 space-y-2 text-center">
                          <div className="font-bold text-small">
                            coredao.org
                          </div>
                          <div className="text-tiny">
                            <Button
                              size="sm"
                              className="text-tiny"
                              onClick={(e) => setNetwork("core")}
                            >
                              switch to this network
                            </Button>
                          </div>
                        </div>
                      }
                    >
                      <div className="md:absolute grid animate-appearance-in top-[70%] right-[7%]">
                        <Chip
                          className="border-none"
                          variant="dot"
                          color="warning"
                        >
                          Core
                        </Chip>
                        <span className="text-[10px] pl-6 text-default-500">
                          0x45c
                        </span>
                      </div>
                    </Tooltip>
                    <Tooltip
                      shouldFlip
                      showArrow
                      color="success"
                      placement="left"
                      content={
                        <div className="px-1 py-2 space-y-2 text-center">
                          <div className="font-bold text-small">
                            etherlink.com
                          </div>
                          <div className="text-tiny">
                            <Button
                              size="sm"
                              className="text-tiny"
                              onClick={(e) => setNetwork("etherlink")}
                            >
                              switch to this network
                            </Button>
                          </div>
                        </div>
                      }
                    >
                      <div className="md:absolute grid animate-appearance-in top-[70%] left-[7%]">
                        <Chip
                          className="border-none"
                          variant="dot"
                          color="success"
                        >
                          Etherlink
                        </Chip>
                        <span className="text-[10px] pl-6 text-default-500">
                          0xa729
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
                    let&apos;s put your emotions <br className="md:hidden" /> at{" "}
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
                    <div className="flex w-16 h-16 rounded-full aspect-square group">
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
                        <Button variant="flat" radius="full" size="sm">
                          minting soon
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex h-full p-8 space-x-3 duration-200 cursor-pointer group text-pretty bg-gradient-to-tr from-zinc-200/50 via-transparent to-zinc-200/50 hover:shadow-md rounded-2xl">
                    <div className="flex w-16 h-16 rounded-full aspect-square group">
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
                    <div className="flex w-16 h-16 rounded-full aspect-square group">
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
                    <div className="flex w-16 h-16 rounded-full aspect-square group">
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
                    <div className="flex w-16 h-16 rounded-full aspect-square group">
                      <EmojiGlass emoji="🎰" />
                    </div>
                    <div className="grid content-between h-full space-y-3">
                      <div className="h-full space-y-3">
                        <h1 className="px-3 text-2xl font-medium">win</h1>
                        <p className="px-3 text-xs">
                          collect scratch card and win awesome prizes
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
                    <div className="flex w-16 h-16 rounded-full aspect-square group">
                      <EmojiGlass emoji="🌉" />
                    </div>
                    <div className="grid content-between h-full space-y-3">
                      <div className="h-full space-y-3">
                        <h1 className="px-3 text-2xl font-medium">bridge</h1>
                        <p className="px-3 text-xs">
                          bridge your tokens to other blockchain
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
              </section>
            </>
          )}
          {selectedTab == "analytics" && (
            <>
              <section className="z-0 w-full md:px-12">
                <div className="flex flex-col items-center justify-center min-h-screen p-3 space-y-6 duration-200 md:p-12 bg-gradient-to-tr from-zinc-100/50 via-transparent to-zinc-200/50 rounded-3xl">
                  <h5 className="text-sm text-center text-bold">
                    PRICE CURVE & SUPPLY DYNAMICS
                  </h5>
                  <div className="animate-appearance-in">
                    <LivePriceChart />
                  </div>
                  <p className="pb-4 text-xs text-center text-balance">
                    This pricing model is designed to create a fair and
                    sustainable ecosystem for degeneratives.art. There&apos;s no
                    cap on the number of NFTs that can be minted, but the
                    exponential price curve acts as a natural limiting factor.
                    The more NFTs that exist, the higher the price becomes for
                    the next one.
                  </p>
                  <div className="justify-center w-full max-w-4xl p-6 mx-auto overflow-x-scroll duration-200 border-2 border-white md:overflow-auto lg:flex bg-white/50 rounded-3xl">
                    {supplies && (
                      <Table
                        removeWrapper
                        className="bg-transparent"
                        color="primary"
                        selectionMode="single"
                        aria-label=""
                      >
                        <TableHeader>
                          <TableColumn>BLOCKCHAIN NETWORK</TableColumn>
                          <TableColumn>CURRENT SUPPLY</TableColumn>
                          <TableColumn>NFT MINT PRICE</TableColumn>
                          {/* <TableColumn>ACTIONS</TableColumn> */}
                        </TableHeader>
                        <TableBody>
                          {Object.keys(supplies).map((network) => (
                            <TableRow key={network}>
                              <TableCell>{supplies[network].network}</TableCell>
                              <TableCell>{supplies[network].supply}</TableCell>
                              <TableCell>
                                {supplies[network].supply &&
                                  calculateMintPrice(supplies[network].supply)}
                              </TableCell>
                              {/* <TableCell>
                              <ButtonGroup>
                                <Button size="sm" radius="full" variant="flat">
                                  Switch
                                </Button>
                                <Button size="sm" radius="full" variant="flat">
                                  Stake
                                </Button>
                                <Button size="sm" radius="full" variant="flat">
                                  Explore
                                </Button>
                              </ButtonGroup>
                            </TableCell> */}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </div>
              </section>
              {/* <section className="sticky top-0 z-10 w-full p-16 bg-default-100 rounded-t-3xl backdrop-blur-sm"></section> */}
            </>
          )}
          {selectedTab == "feels" && (
            <>
              <section className="min-h-screen">
                <div className="flex flex-col items-center justify-center w-full p-3 md:p-16">
                  <h1 className="max-w-3xl text-4xl text-center lowercase text-pretty">
                    Discover what other homies are feeling today
                  </h1>
                  <div className="flex items-center justify-center mt-16">
                    <ul className="grid gap-6 md:grid-cols-3">
                      {fetching ? (
                        <>
                          <AssetLoader />
                          <AssetLoader />
                          <AssetLoader />
                        </>
                      ) : (
                        <>
                          {allAssets?.map((token) => (
                            <Link
                              href={`/id/${token.tokenId}?network=${token.network}`}
                              key={token.tokenId}
                              className="flex flex-col items-center justify-center p-2 duration-200 border-2 border-white shadow-md bg-default-100 hover:shadow rounded-3xl"
                            >
                              <div className="p-6 duration-300 bg-white group-hover:shadow rounded-2xl">
                                <EmojisContainer token={token} />
                              </div>
                              <div className="flex flex-col items-start justify-between w-full px-2 pt-3 pb-1 text-xs text-black">
                                <div className="flex items-center justify-between w-full font-semibold">
                                  <p>degeneratives.art #{token.tokenId}</p>
                                  <p>{token?.network}</p>
                                </div>
                                <div className="">
                                  <p>
                                    {token.owner.slice(0, 5)}
                                    ...
                                    {token.owner.slice(-4)}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </section>
            </>
          )}
          {selectedTab == "explore" && (
            <>
              <section className="min-h-screen"></section>
            </>
          )}
          <div className="mb-6 md:mx-12">
            <footer className="z-0 w-full p-6 py-16 text-sm text-center md:px-12 bg-gradient-to-tr from-zinc-200/50 via-transparent to-zinc-200/50 rounded-3xl">
              Powered by{" "}
              <Link href="https://ocvlabs.com" color="foreground" size="sm">
                OnChainVision
              </Link>{" "}
              and{" "}
              <Link href="https://hexalana.com" color="foreground" size="sm">
                Hexalana
              </Link>
            </footer>
          </div>
        </main>
      )}
      <MintModal isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} />
    </>
  );
}

{
  /* <div className="absolute top-0">
  <iframe
    ref={iframeRef}
    title="Rendered Document"
    width="100%"
    className="w-screen min-h-[60vh] overflow-hidden"
  />
</div>; */
}
