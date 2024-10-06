"use client";

import { Context } from "@/providers/Providers";
import React, { useContext, useEffect, useCallback, useState } from "react";
import { Pie, PieChart, Sector } from "recharts";

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
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
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
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        className="text-sm"
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#000"
      >{`${value} NFTs`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#000"
        className="text-xs"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export const Statistics = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  return (
    <div className="grid w-full gap-3 p-6 md:grid-cols-2">
      <div className="flex items-center justify-center ">
        <PieChart width={400} height={400}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={
              data?.length > 0
                ? data
                : [
                    {
                      name: "Etherlink",
                      value: 1120,
                    },
                  ]
            }
            cx={200}
            cy={200}
            innerRadius={60}
            outerRadius={80}
            fill="#000"
            dataKey="value"
            onMouseEnter={onPieEnter}
          />
        </PieChart>
      </div>

      <div className="grid items-center content-center justify-center h-full max-w-sm grid-cols-2 gap-6 mx-auto gap-x-12">
        {data.map((supply, index) => (
          <>
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center"
            >
              <h1 className="text-5xl font-semibold">{supply.value}</h1>
              <h1 className="text-xs font-semibold uppercase text-default-700">
                {supply.name} NFTs
              </h1>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};
