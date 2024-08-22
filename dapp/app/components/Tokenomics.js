import { useState } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const MOOD_TOKENOMICS = {
  total_supply: 100000000, // 100 Million MOOD
  allocation: [
    { name: "NFT Minting Rewards", value: 10000000, color: "#ffb961" }, // 10%
    { name: "NFT Staking Rewards", value: 5000000, color: "#f3826f" }, // 5%
    { name: "LP Staking Rewards", value: 5000000, color: "#c05c7e" }, // 5%
    { name: "MOOD Staking Rewards", value: 5000000, color: "#722d61" }, // 5%
    { name: "Onchain Gaming Rewards", value: 20000000, color: "#2d3561" }, // 20%
    { name: "Initial LP for Market Making", value: 25000000, color: "#044855" }, // 25%
    {
      name: "DEX/CEX/CrossChainBridge LPs",
      value: 20000000,
      color: "#793f4e",
    }, // 20%
    { name: "Development", value: 7000000, color: "#c0424e" }, // 7%
    { name: "Marketing", value: 3000000, color: "#d94b58" }, // 3%
  ],
};

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 30;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        className="font-bold"
        fill={fill}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 2}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={6} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 16}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >
        {payload.name}
      </text>
      <text
        className="text-xs"
        x={ex + (cos >= 0 ? 1 : -1) * 18}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`${value} MOOD`}
      </text>
    </g>
  );
};

const MoodTokenomicsChart = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div className="w-full h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* <Pie
            
            data={MOOD_TOKENOMICS.allocation}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {MOOD_TOKENOMICS.allocation.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie> */}
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={MOOD_TOKENOMICS.allocation}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={140}
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {MOOD_TOKENOMICS.allocation.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodTokenomicsChart;
