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

export const calculateMintPrice = (totalSupply) => {
  const priceInWei = BigInt(10e12) * BigInt(totalSupply) ** BigInt(2);
  const priceInEth = ethers.formatEther(priceInWei);
  return parseFloat(priceInEth).toFixed(5);
};

const LivePriceChart = () => {
  const { totalSupply } = useContext(Context);
  const [data, setData] = useState([]);

  // Off-chain price calculation function

  useEffect(() => {
    const fetchData = async () => {
      // Calculate mint prices for all supplies up to the max
      const priceData = Array.from({ length: 5000 }, (_, i) => ({
        name: `TOKEN ID#${i.toString()}`,
        supply: i.toString(),
        price: calculateMintPrice(i),
      }));

      setData(priceData); // Set full price curve data
    };

    fetchData(); // Fetch data initially
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [totalSupply]);

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
    <div className="w-[95vw] md:w-[80vw] h-[60vh] pr-8 md:pr-12 ">
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
            name="price"
            dataKey="price"
            stroke="black"
            fill="black"
            r={1}
          />
          <ReferenceDot
            x={totalSupply.toString()}
            y={calculateMintPrice(totalSupply)}
            r={3}
            fill="white"
            stroke="black"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LivePriceChart;
