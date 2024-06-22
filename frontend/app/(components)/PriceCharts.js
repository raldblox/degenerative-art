import { useEffect, useState } from "react";
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
} from "recharts";
import { ethers } from "ethers";

export const calculateMintPrice = (totalSupply) => {
  const priceInWei = BigInt(10e12) * BigInt(totalSupply) ** BigInt(2);
  const priceInEth = ethers.formatEther(priceInWei);
  return parseFloat(priceInEth).toFixed(5);
};

const LivePriceChart = () => {
  const [data, setData] = useState([]);
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(100);
  const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";

  // Off-chain price calculation function

  useEffect(() => {
    const fetchData = async () => {
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const contract = new ethers.Contract(
      //   CONTRACT_ADDRESS,
      //   DegenerativesArtABI,
      //   provider
      // );
      // const totalSupply = await contract.totalSupply();
      setTotalSupply(10);

      // Calculate mint prices for all supplies up to the max
      const priceData = Array.from({ length: maxSupply }, (_, i) => ({
        supply: i.toString(),
        price: calculateMintPrice(i),
      }));

      setData(priceData); // Set full price curve data
    };

    fetchData(); // Fetch data initially
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  return (
    <LineChart width={780} height={300} data={data}>
      <CartesianGrid strokeDasharray="2 2" />
      <XAxis dataKey="supply" fontSize={10} />
      <YAxis fontSize={10} />
      <Tooltip
        label={{
          value: `Current Supply: ${totalSupply} | Mint Price: ${calculateMintPrice(
            totalSupply
          )} ether`,
          position: "insideTopLeft",
          fill: "blue",
          fontSize: "10",
        }}
      />
      <Line type="linear" dataKey="price" stroke="blue" fill="none" />
      {/* <ReferenceDot
        x={totalSupply.toString()}
        y={calculateMintPrice(totalSupply)}
        r={8}
        fill="blue"
        stroke="blue"
        strokeDasharray="3 3"
      /> */}
      {/* <ReferenceLine
        x={totalSupply.toString()}
        stroke="blue"
        strokeDasharray="3 3"
        label={{
          value: `Current Supply: ${totalSupply} | Mint Price: ${calculateMintPrice(
            totalSupply
          )} ether`,
          position: "insideTopLeft",
          fill: "blue",
          fontSize: "12",
        }}
      /> */}
    </LineChart>
  );
};

export default LivePriceChart;
