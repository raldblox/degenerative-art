import {
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";
import LivePriceChart from "./PriceCharts";

const Analytics = ({ shuffledContent }) => {
  return (
    <div className={`${mounted ? "w-full" : "hidden"}`}>
      <section className="relative w-full pb-16 bg-default-50 rounded-3xl">
        <div className="absolute top-0 w-full">
          <iframe
            ref={iframeRef}
            title="Rendered Document"
            width="100%"
            className="w-full h-[65vh] overflow-hidden"
          />
        </div>
        <div
          className={`z-20 flex-col w-full p-2 items-center justify-center md:p-16 space-y-16`}
        >
          <div className="max-w-6xl mt-8 text-4xl font-bold leading-tight tracking-tight text-center lowercase drop-shadow-md text-balance md:text-6xl">
            {shuffledContent.headline[0]}
          </div>
          <section className="grid max-w-4xl grid-cols-2 gap-2 p-2 mt-2 md:grid-cols-4">
            <div className="max-w-4xl col-span-2 p-4 mt-12 duration-200 border-2 shadow-sm md:col-span-4 md:p-8 bg-white/50 border-white/80 rounded-3xl hover:shadow-md backdrop-blur-xl">
              <div className="flex flex-col items-center">
                <label className="text-lg font-bold tracking-tight text-center lowercase text-balance md:text-xl">
                  Enter the one-time emoji mood that universe gave you today.
                </label>
                <p className="mt-4 text-sm text-center lowercase">
                  Don&apos;t worry if your cosmic vibes change tomorrow... your
                  NFT is always listening and so well-prepared to evolve
                  alongside you! We&apos;ll provide you $MOOD token after nft
                  mint to fuel your daily mood swings for the next hundred
                  years! Your ever-changing feelings have finally found a match.
                </p>
                <div className="flex flex-col items-center justify-center pt-6 pb-6 space-y-4">
                  <div
                    ref={fieldsRef}
                    className="flex flex-wrap items-center justify-center gap-2 p-4 rounded-lg bg-white/80"
                  >
                    {renderInputFields()}
                  </div>
                  <label className="text-sm">(enter 3-9 emojis only)</label>
                </div>
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
                  className="dark"
                  // isDisabled
                >
                  mint to generate 🪄
                </Button>
              </div>
            </div>
            <div className="col-span-2 p-3 duration-200 border-2 shadow-sm md:p-6 md:col-span-4 border-white/80 bg-white/50 rounded-3xl hover:shadow-md backdrop-blur-xl">
              <h5 className="text-sm text-center">RECENTLY MINTED GENART</h5>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-3 md:gap-4 drop-shadow-md ">
                {shuffledContent?.placeholders.map((emoji, i) => (
                  <div
                    className="p-2 border-2 shadow-md cursor-pointer cell group border-white/40"
                    key={i}
                  >
                    <span className="absolute text-[5rem] transition-all group-hover:scale-125 duration-300 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 blur-md opacity-30">
                      {emoji}
                    </span>
                    <span className="text-5xl">{emoji}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-col items-center hidden p-6 space-y-6 duration-200 border-2 border-white shadow-sm justify-cente lg:flex md:col-span-4 bg-white/50 backdrop-blur-xl rounded-3xl hover:shadow-md">
              <h5 className="text-sm text-center text-bold">
                PRICE CURVE & SUPPLY DYNAMICS
              </h5>
              <div className="pr-12">
                <LivePriceChart />
              </div>
              <p className="pb-4 text-xs text-center text-balance">
                This pricing model is designed to create a fair and sustainable
                ecosystem for degeneratives.art. There&apos;s no cap on the
                number of NFTs that can be minted, but the exponential price
                curve acts as a natural limiting factor. The more NFTs that
                exist, the higher the price becomes for the next one.
              </p>
            </div>
            <div className="col-span-2 p-6 overflow-x-scroll duration-200 border-2 border-white shadow-sm md:overflow-auto md:col-span-4 justify-cente lg:flex bg-white/50 backdrop-blur-xl rounded-3xl hover:shadow-md">
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
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow key="1">
                    <TableCell>Polygon</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>0 MATIC</TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                  <TableRow key="2">
                    <TableCell>Core Chain</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>0 CORE</TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                  <TableRow key="3">
                    <TableCell>Etherlink</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>0 XTZ</TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="p-4 duration-200 border-2 border-white shadow-sm bg-white/50 backdrop-blur-xl rounded-3xl aspect-square hover:shadow-md">
              <h5 className="text-xs text-bold">BLOCKCHAINS</h5>
              <p className="text-lg font-bold">-</p>
            </div>

            <div className="p-4 duration-200 border-2 border-white shadow-sm bg-white/50 backdrop-blur-xl rounded-3xl aspect-square hover:shadow-md">
              <h5 className="text-xs text-bold">TOTAL SUPPLIES</h5>
              <p className="text-lg font-bold">-</p>
            </div>
            <div className="p-4 duration-200 border-2 border-white shadow-sm bg-white/50 backdrop-blur-xl rounded-3xl aspect-square hover:shadow-md">
              <h5 className="text-xs text-bold">LIQUIDITY POOLS</h5>
              <p className="text-lg font-bold">-</p>
            </div>
            <div className="p-4 duration-200 border-2 border-white shadow-sm bg-white/50 backdrop-blur-xl rounded-3xl aspect-square hover:shadow-md">
              <h5 className="text-xs text-bold">$MOOD DISTRIBUTED</h5>
              <p className="text-lg font-bold">-</p>
            </div>
            <div
              id="info"
              className="col-span-2 p-6 py-12 duration-200 border-2 shadow-sm md:col-span-4 border-white/80 rounded-3xl bg-white/40 backdrop-blur-xl hover:shadow-md"
            >
              <h1 className="text-sm text-center lowercase md:text-base max-w-7xl text-balance">
                <span className="font-bold">How does it even work? </span>{" "}
                {`uhmm... as the intern, my main job is fetching coffee for the devs... but I did overhear them talking about "onchain graphics algorithms" and "interactive assets" ✨ don't ask me for details.. I'm just here for the free mints and good vibes, tbh 😉 But hey, you can check out OnChainVision if you want to learn more from the... uh... blockchain scientists? 🧪 They seem to be like dissecting static NFTs, injecting them with alien code, and... honestly, it's kinda creepy. Gotta go 😳`}
              </h1>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Analytics;
