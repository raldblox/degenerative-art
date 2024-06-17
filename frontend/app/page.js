"use client";

import {
  Button,
  ButtonGroup,
  Chip,
  Input,
  Link,
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
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import LivePriceChart, { calculateMintPrice } from "./(components)/PriceCharts";
import EmojisContainer from "./(components)/EmojisContainer";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [supplies, setSupplies] = useState(null);
  const [allEmojis, setAllEmojies] = useState(null);
  const [selectedTab, setSelectedTab] = useState("home");
  const [fetching, setFetching] = useState(false);

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

  const fieldsRef = useRef(null);
  const [activeFields, setActiveFields] = useState(3);
  const maxFields = 9;
  const inputRef = useRef([]);
  const [inputValues, setInputValues] = useState(Array(maxFields).fill(""));

  const [htmlContent, setHtmlContent] = useState("");
  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchHtml = async () => {
      if (fetching) {
        return;
      }
      setFetching(true);
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
        const allEmojis = {};
        for (const item of supplies.results) {
          const network = item.network;
          const supply = item.supply;

          for (let index = 0; index < supply; index++) {
            const emojiUrl = `${protocol}/api/getEmojis/${network}/${index}`;
            const emoji = await fetch(emojiUrl).then((res) => res.json());
            allEmojis[network] = {
              supply,
              emojis: emoji,
            };
          }
        }

        setAllEmojies(allEmojis);
        console.log("allEmojis:", allEmojis);
        setFetching(false);
      } catch (error) {
        console.error("Error fetching HTML:", error);
        setFetching(false);
      }
    };
    fetchHtml();
  }, []);

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDocument = iframeRef.current.contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(htmlContent);
      iframeDocument.close();
    }
  }, [htmlContent]);

  useEffect(() => {
    if (fieldsRef) {
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

  const handleChange = (event, index) => {
    const value = event.target.value.slice(-1); // Get the last entered character
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
          key={i}
          size="lg"
          type="text"
          data-index={i}
          // placeholder={shuffledContent.placeholders[i]}
          ref={(el) => (inputRef.current[i] = el)}
          className={`w-12 h-12 placeholder:saturate-0 text-2xl text-center rounded-lg border-3 border-black outline-none focus:border-indigo-600 ${
            i >= activeFields ? "hidden" : ""
          }`}
          onChange={(e) => handleChange(e, i)}
          onKeyUp={(e) => handleKeyUp(e, i)}
        />
      );
    }
    return inputFields;
  };

  const NavBar = () => {
    return (
      <Navbar
        position="sticky"
        maxWidth="2xl"
        className="z-50 h-[70px] bg-transparent backdrop-blur-none"
      >
        <NavbarBrand>
          <Link href="/" className="md:px-3">
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
        </NavbarBrand>
        <NavbarContent className="flex h-[50px]" justify="center">
          <NavbarItem className="backdrop-blur-sm">
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
          </NavbarItem>
        </NavbarContent>
        <NavbarContent
          className="items-center hidden gap-2 sm:flex"
          justify="end"
        >
          <NavbarItem>
            <Button
              size="sm"
              color="foreground"
              variant="bordered"
              radius="full"
              className="font-bold border-small"
            >
              mint
            </Button>
          </NavbarItem>
          <NavbarItem className="">
            <Button
              size="sm"
              color="foreground"
              variant="bordered"
              radius="full"
              className="font-bold border-small"
            >
              stake
            </Button>
          </NavbarItem>
          <NavbarItem className="pr-2">
            <Button
              size="sm"
              color="foreground"
              variant="bordered"
              radius="full"
              className="font-bold border-small"
            >
              connect
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    );
  };

  return (
    <>
      <main className="relative w-full min-h-screen">
        <NavBar />
        {selectedTab == "home" && (
          <>
            <section className="relative min-h-screen md:mx-12">
              <div className="flex relative flex-col space-y-8 items-center min-h-[75vh] justify-center w-full h-full p-12 bg-gradient-to-tr from-zinc-100/50 via-transparent to-zinc-200/50 rounded-3xl">
                <span className="p-1 px-4 text-center lowercase rounded-full bg-default-100 text-tiny text-balance border-small">
                  Where Emotions 😑 Become Art 🎨 and Currency 🪙
                </span>
                <h1 className="max-w-4xl text-3xl font-semibold text-center lowercase md:text-5xl text-pretty animate-appearance-in">
                  {shuffledContent.headline[0]}
                </h1>
                <p className="max-w-2xl text-[10px] md:text-xs text-center text-pretty">
                  {" "}
                  Don&apos;t worry if your cosmic vibes change tomorrow... your
                  NFT is always listening and so well-prepared to evolve
                  alongside you! We&apos;ll provide you $MOOD token after nft
                  mint to fuel your daily mood swings for the next 90 days! Your
                  ever-changing feelings have finally found a match.
                </p>
                <div className="flex gap-2 ">
                  <Button
                    fullWidth
                    as={Link}
                    href="#mint"
                    size="sm"
                    radius="full"
                    variant="solid"
                    color="default"
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
                  <div className="md:absolute grid animate-appearance-in top-[15%] right-[10%]">
                    <Chip className="border-none" variant="dot" color="primary">
                      Base
                    </Chip>
                    <span className="text-[10px] pl-6 text-default-500">
                      0x2105
                    </span>
                  </div>
                  <div className="md:absolute grid animate-appearance-in top-[70%] right-[7%]">
                    <Chip className="border-none" variant="dot" color="warning">
                      Core
                    </Chip>
                    <span className="text-[10px] pl-6 text-default-500">
                      0x45c
                    </span>
                  </div>
                  <div className="md:absolute grid animate-appearance-in top-[70%] left-[7%]">
                    <Chip className="border-none" variant="dot" color="success">
                      Etherlink
                    </Chip>
                    <span className="text-[10px] pl-6 text-default-500">
                      0xa729
                    </span>
                  </div>
                </div>
              </div>
              <div
                id="mint"
                className="flex flex-col items-center justify-center w-full h-full min-h-[50vh] p-12 bg-gradient-to-tr from-default-100/50 via-transparent to-default-100/80 rounded-3xl"
              >
                <h1 className="text-5xl text-center">minting soon</h1>
              </div>
            </section>
          </>
        )}
        {selectedTab == "analytics" && (
          <>
            <section className="z-0 w-full px-12">
              <div className="flex-col items-center justify-center hidden min-h-screen p-12 space-y-6 duration-200 lg:flex bg-gradient-to-tr from-zinc-100/50 via-transparent to-zinc-200/50 rounded-3xl">
                <h5 className="text-sm text-center text-bold">
                  PRICE CURVE & SUPPLY DYNAMICS
                </h5>
                <div className="pr-12 animate-appearance-in">
                  <LivePriceChart />
                </div>
                <p className="pb-4 text-xs text-center text-balance">
                  This pricing model is designed to create a fair and
                  sustainable ecosystem for degeneratives.art. There&apos;s no
                  cap on the number of NFTs that can be minted, but the
                  exponential price curve acts as a natural limiting factor. The
                  more NFTs that exist, the higher the price becomes for the
                  next one.
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
                              {calculateMintPrice(supplies[network].supply)}
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
                  {allEmojis ? (
                    <ul className="grid gap-6 md:grid-cols-3">
                      <>
                        {Object.keys(allEmojis).map((network) => (
                          <Link
                            href={`/id/${allEmojis[network]?.emojis.tokenId}?network=${network}`}
                            key={network}
                            className="flex flex-col items-center justify-center p-2 duration-200 border-2 border-white shadow-md bg-default-100 hover:shadow rounded-3xl"
                          >
                            <div className="p-6 duration-300 bg-white group-hover:shadow rounded-2xl">
                              <EmojisContainer
                                emojis={allEmojis[network]?.emojis}
                              />
                            </div>
                            <div className="flex flex-col items-start justify-between w-full pt-3 pb-1 pl-2 text-xs text-black">
                              <div className="flex items-center justify-between w-full font-semibold">
                                <p>
                                  degeneratives.art #
                                  {allEmojis[network]?.emojis.tokenId}
                                </p>
                                <p>{network}</p>
                              </div>
                              <div className="">
                                <p>
                                  {allEmojis[network]?.emojis.owner.slice(0, 5)}
                                  ...
                                  {allEmojis[network]?.emojis.owner.slice(-4)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </>
                    </ul>
                  ) : (
                    <div className="">
                      <Spinner />
                    </div>
                  )}
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
            Powered by OnChainVision
          </footer>
        </div>
      </main>
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
