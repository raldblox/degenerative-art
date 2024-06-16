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
          <Link href="/" className="px-3">
            <svg
              className="h-8"
              viewBox="0 0 760 800"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M671.515 138.281L461.285 19.9234C439.047 7.08085 409.481 0 378.043 0C346.613 0 317.047 7.07234 294.851 19.8809L87.3277 138.366C39.1745 166.145 0 230.392 0 281.566V518.451C0 569.438 39.4383 633.668 88.0596 661.719L298.298 780.077C320.545 792.919 350.111 800 381.549 800C412.979 800 442.545 792.928 464.732 780.119L672.281 661.634C720.425 633.847 759.6 569.617 759.6 518.451V281.566C759.591 230.579 720.145 166.34 671.515 138.281ZM727.268 518.451C727.268 557.949 694.025 611.77 656.187 633.591L448.638 752.085C431.472 761.992 407.013 767.677 381.549 767.677C356.068 767.677 331.617 761.992 314.306 751.992L104.068 633.634C65.8553 611.583 32.3234 557.753 32.3234 518.451V281.566C32.3234 242.068 65.5745 188.23 103.421 166.409L310.945 47.9149C328.119 38.0085 352.57 32.3234 378.043 32.3234C403.515 32.3234 427.966 38.0085 445.268 48.0085L655.506 166.366C693.736 188.426 727.268 242.255 727.268 281.566V518.451Z"
                fill="black"
              />
              <path
                d="M727.268 518.451C727.268 557.949 694.025 611.77 656.187 633.591L448.638 752.085C431.472 761.992 407.013 767.677 381.549 767.677C356.068 767.677 331.617 761.992 314.306 751.992L104.068 633.634C65.8553 611.583 32.3234 557.753 32.3234 518.451V281.566C32.3234 242.068 65.5745 188.23 103.421 166.409L310.945 47.9149C328.119 38.0085 352.57 32.3234 378.043 32.3234C403.515 32.3234 427.966 38.0085 445.268 48.0085L655.506 166.366C693.736 188.426 727.268 242.255 727.268 281.566V518.451Z"
                fill="white"
              />
              <path
                d="M656.437 634.025L656.435 634.026L448.888 752.518C448.888 752.518 448.887 752.519 448.887 752.519C431.626 762.48 407.075 768.177 381.549 768.177C356.007 768.177 331.466 762.48 314.061 752.427L314.056 752.424M656.437 634.025L314.056 752.424M656.437 634.025C675.446 623.062 693.271 604.083 706.342 582.913C719.412 561.746 727.768 538.324 727.768 518.451V281.566C727.768 261.785 719.338 238.407 706.148 217.232C692.955 196.053 674.96 177.014 655.756 165.933L655.752 165.93M656.437 634.025L655.752 165.93M314.056 752.424L103.823 634.07L103.818 634.067C84.6234 622.991 66.6326 603.953 53.4416 582.776C40.2532 561.603 31.8234 538.228 31.8234 518.451V281.566C31.8234 261.693 40.1819 238.267 53.2544 217.096C66.3291 195.921 84.1584 176.938 103.172 165.975L103.173 165.974L310.695 47.4818M314.056 752.424L310.695 47.4818M310.695 47.4818C310.695 47.4814 310.696 47.481 310.697 47.4807M310.695 47.4818L310.697 47.4807M448.388 751.652L448.39 751.651L655.937 633.158L448.388 751.652ZM448.388 751.652C431.317 761.504 406.949 767.177 381.549 767.177C356.132 767.177 331.773 761.504 314.556 751.559L314.552 751.556M448.388 751.652L314.552 751.556M314.552 751.556L104.318 633.201M314.552 751.556L104.318 633.201M311.194 48.348L311.193 48.3491L103.671 166.842C84.8373 177.701 67.1177 196.547 54.1052 217.621C41.0905 238.699 32.8234 261.942 32.8234 281.566V518.451C32.8234 537.976 41.1596 561.167 54.2904 582.247C67.4174 603.322 85.2972 622.224 104.313 633.198L104.318 633.201M311.194 48.348L104.318 633.201M311.194 48.348C328.274 38.4962 352.634 32.8234 378.043 32.8234C403.451 32.8234 427.81 38.4961 445.018 48.4414L445.023 48.4442M311.194 48.348L445.023 48.4442M445.023 48.4442L655.256 166.799C655.258 166.8 655.259 166.8 655.26 166.801C674.285 177.78 692.17 196.684 705.299 217.761C718.432 238.844 726.768 262.037 726.768 281.566V518.451C726.768 538.076 718.503 561.314 705.492 582.387M445.023 48.4442L705.492 582.387M655.752 165.93L445.518 47.5756C445.518 47.5752 445.517 47.5747 445.516 47.5743C428.119 37.5205 403.577 31.8234 378.043 31.8234C352.508 31.8234 327.966 37.5204 310.697 47.4807M655.752 165.93L310.697 47.4807M705.492 582.387C692.483 603.456 674.768 622.298 655.939 633.157L705.492 582.387ZM461.035 20.3564L461.04 20.3591L671.265 138.714C671.266 138.715 671.267 138.715 671.268 138.716C695.496 152.696 717.458 175.704 733.364 201.587C749.273 227.475 759.096 256.191 759.1 281.566V518.451C759.1 543.917 749.347 572.676 733.568 598.549C717.79 624.42 696.016 647.358 672.031 661.201L464.484 779.685L464.482 779.686C442.386 792.442 412.911 799.5 381.549 799.5C350.179 799.5 320.703 792.433 298.548 779.644L298.543 779.641L88.3094 661.286C88.3083 661.285 88.3072 661.285 88.306 661.284C64.0827 647.308 42.125 624.305 26.2228 598.424C10.3182 572.54 0.5 543.826 0.5 518.451V281.566C0.5 256.096 10.253 227.33 26.0333 201.453C41.8121 175.578 63.588 152.638 87.5775 138.799L295.099 20.3151L295.101 20.3139C317.205 7.55812 346.681 0.5 378.043 0.5C409.413 0.5 438.888 7.56655 461.035 20.3564Z"
                stroke="#222222"
              />
              <path
                d="M377.374 510.633L377.374 510.633C395.291 516.258 409.944 528.492 418.688 545.11L401.129 554.294C388.119 529.628 357.499 520.048 332.781 532.97C308.072 545.866 298.432 576.45 311.208 601.203L293.641 610.354C275.813 575.915 289.228 533.358 323.605 515.403L323.605 515.403C340.301 506.669 359.389 504.971 377.374 510.633Z"
                fill="black"
                stroke="#222222"
                stroke-width="0.382696"
              />
              <path
                d="M230.626 379.784C230.626 401.995 212.62 420.001 190.409 420.001C168.197 420.001 150.191 401.995 150.191 379.784C150.191 357.572 168.197 339.566 190.409 339.566C212.62 339.566 230.626 357.572 230.626 379.784Z"
                fill="black"
                stroke="#222222"
                stroke-width="0.382696"
              />
              <path
                d="M546.845 256.895C574.954 247.68 609.321 251.176 653.818 282.563L630.728 315.255C600.103 293.65 578.405 289.164 559.555 294.943C550.121 297.835 541.418 303.293 532.678 310.431C523.949 317.56 515.174 326.374 505.597 335.994L505.566 336.025L505.701 336.16L505.566 336.025C502.281 339.327 498.92 342.697 495.474 346.066L495.305 346.231L495.502 346.362C506.31 353.562 513.442 365.852 513.442 379.828C513.442 402.054 495.459 420.045 473.233 420.045C454.108 420.045 438.192 406.688 434.118 388.815L434.07 388.607L433.868 388.677C423.81 392.169 412.963 394.233 401.123 394.233C385.463 394.233 368.117 390.661 348.643 382.113L364.753 345.484C389.517 356.331 408.287 356.303 425.533 348.859C442.802 341.406 458.522 326.524 477.199 307.767C496.762 288.127 518.682 266.127 546.845 256.895Z"
                fill="black"
                stroke="#222222"
                stroke-width="0.382696"
              />
            </svg>
          </Link>
        </NavbarBrand>
        <NavbarContent className="flex h-[50px]" justify="center">
          <NavbarItem>
            <Tabs
              size="sm"
              className=""
              classNames={{
                tabList:
                  "border-small gap-1 backdrop-blur-md bg-default-100/80",
              }}
              variant="bordered"
              radius="full"
              color="default"
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
            <section className="relative min-h-screen my-6 md:mx-12">
              <div className="flex relative flex-col space-y-8 items-center min-h-[75vh] justify-center w-full h-full p-12 bg-gradient-to-tr from-zinc-100/50 via-transparent to-zinc-200/50 rounded-3xl">
                <span className="p-1 px-2 text-center lowercase rounded-full bg-default-100 text-tiny text-balance border-small">
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
                    color="primary"
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
                <div className="flex flex-wrap items-center justify-center">
                  <div className="md:absolute animate-appearance-in top-[15%] left-[10%]">
                    <Chip
                      className="border-none"
                      variant="dot"
                      color="secondary"
                    >
                      Polygon
                    </Chip>
                  </div>
                  <div className="md:absolute animate-appearance-in top-[15%] right-[10%]">
                    <Chip className="border-none" variant="dot" color="primary">
                      Base
                    </Chip>
                  </div>
                  <div className="md:absolute animate-appearance-in top-[70%] right-[7%]">
                    <Chip className="border-none" variant="dot" color="warning">
                      Core Chain
                    </Chip>
                  </div>
                  <div className="md:absolute animate-appearance-in top-[70%] left-[7%]">
                    <Chip className="border-none" variant="dot" color="success">
                      Etherlink
                    </Chip>
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
            <section className="sticky top-0 z-0 w-full min-h-screen p-12">
              <div className="flex-col items-center hidden p-12 space-y-6 duration-200 border-2 border-white shadow-sm justify-cente lg:flex bg-white/50 backdrop-blur-xl rounded-3xl hover:shadow-md">
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
                            className="flex flex-col items-center justify-center p-2 duration-200 border-white shadow bg-default-100 hover:shadow-md border-small rounded-3xl"
                          >
                            <div className="p-6 duration-300 bg-white group-hover:shadow rounded-2xl">
                              <EmojisContainer
                                emojis={allEmojis[network]?.emojis}
                              />
                            </div>
                            <div className="flex items-center justify-between w-full pt-2 pb-1 pl-4 pr-2 text-xs">
                              <h5 className="">
                                {allEmojis[network]?.emojis.owner.slice(0, 5)}
                                ...{allEmojis[network]?.emojis.owner.slice(-4)}
                              </h5>
                              <div>
                                <Chip
                                  className="border-none"
                                  variant="dot"
                                  size="sm"
                                >
                                  {network}
                                </Chip>
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

        {/* <footer className="sticky bottom-0 z-0 w-full p-6 text-sm text-center bg-default-100">
          Powered by OnChainVision
        </footer> */}
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
