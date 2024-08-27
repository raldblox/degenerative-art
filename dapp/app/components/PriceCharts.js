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
import { Context } from "../providers/Providers";
import { Spinner } from "@nextui-org/react";
import priceData from "@/app/libraries/price_data.json"; // Import the JSON data

export const calculateMintPrice = (totalSupply) => {
  const priceInWei = BigInt(10e12) * BigInt(totalSupply) ** BigInt(2);
  const priceInEth = ethers.formatEther(priceInWei);
  return parseFloat(priceInEth).toFixed(5);
};

const LivePriceChart = () => {
  const { totalSupply, data, setData } = useContext(Context);

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
        <div className="p-4 border border-black bg-white/90 rounded-xl">
          <p className="text-sm">{`TOKEN SUPPLY: ${label}`}</p>
          <p className="text-sm intro">{`MINT PRICE: ${payload[0].value} $XTZ`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="w-[95vw] md:w-[80vw] h-[400px] pr-8 md:pr-12 ">
        <ResponsiveContainer
          width="100%"
          height="100%"
          className="max-w-3xl mx-auto"
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
              stroke="black"
              fill="black"
              r={1}
            />
            <Legend />
            <ReferenceDot
              x={roundedTotalSupply.toString()}
              y={calculateMintPrice(roundedTotalSupply)}
              r={3}
              fill="white"
              stroke="blue"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default LivePriceChart;
