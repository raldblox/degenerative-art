"use client";

import { useContext, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { ethers } from "ethers";

import priceData from "@/libraries/price_data.json"; // Import the JSON data
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Context } from "@/providers/Providers";

// export const calculateMintPrice = ({ totalSupply }) => {
//   const priceInWei = BigInt(10e12) * BigInt(totalSupply) ** BigInt(2);
//   const priceInEth = ethers.formatEther(priceInWei);
//   return parseFloat(priceInEth).toFixed(5);
// };

const LivePriceChart = ({ totalSupply }) => {
  const {} = useContext(Context);
  const [data, setData] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const roundedTotalSupply = Math.round(Number(totalSupply) / 10) * 10;

  // Off-chain price calculation function

  useEffect(() => {
    const fetchData = async () => {
      setData(priceData); // Set full price curve data
    };

    fetchData(); // Fetch data initially
  }, [totalSupply]);

  // Round totalSupply to the nearest multiple of 10

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 border border-foreground bg-background/90 rounded-xl">
          <p className="text-sm">{`TOKEN SUPPLY: ${label}`}</p>
          <p className="text-sm intro">{`MINT PRICE: ${payload[0].value} $XTZ`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Button
        onClick={onOpen}
        radius="sm"
        variant="flat"
        color="default"
        size="sm"
        startContent={<span className="text-base">🧮</span>}
      >
        Simulate Price
      </Button>
      <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="md:py-16">
          {(onClose) => (
            <>
              <ModalBody className="flex items-center justify-center space-y-6">
                <h1 className="text-lg text-center">
                  NFT MINT PRICE CURVE & SUPPLY DYNAMICS
                </h1>
                <div className="w-full md:w-[80vw] h-[400px]">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    className="max-w-2xl mx-auto -translate-x-5"
                  >
                    <LineChart width="100%" height="100%" data={data}>
                      <CartesianGrid strokeDasharray="1 5" />
                      <XAxis dataKey="supply" fontSize={10} />
                      <YAxis dataKey="price" fontSize={10} />
                      <Tooltip
                        cursor={{ stroke: "blue", strokeWidth: 2 }}
                        content={<CustomTooltip />}
                      />
                      <Line
                        type="monotone"
                        name="mint price curve"
                        dataKey="price"
                        stroke="blue"
                        fill="gray"
                        r={1}
                      />
                      <Legend />
                      <ReferenceDot
                        x={roundedTotalSupply.toString()}
                        // y={calculateMintPrice(roundedTotalSupply)}
                        r={3}
                        fill="blue"
                        stroke="blue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="max-w-4xl text-xs text-center">
                  This pricing model is designed to create a fair and
                  sustainable ecosystem for degeneratives.art. There&apos;s no
                  cap on the number of NFTs that can be minted, but the
                  exponential price curve acts as a natural limiting factor. The
                  more NFTs that exist, the higher the price becomes for the
                  next one.
                </p>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default LivePriceChart;
