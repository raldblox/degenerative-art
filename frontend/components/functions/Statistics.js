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
  const sx = cx + (outerRadius + 5) * cos;
  const sy = cy + (outerRadius + 5) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 5;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={7} textAnchor="middle" fill={fill}>
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
        innerRadius={outerRadius + 3}
        outerRadius={outerRadius + 5}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />
      <text
        className="text-xs"
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
        <PieChart width={320} height={320}>
          <Pie
            className="p-16"
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={
              data?.length > 0
                ? data
                : [
                    {
                      name: "No Data",
                      value: 100,
                    },
                  ]
            }
            cx={160}
            cy={160}
            innerRadius={50}
            outerRadius={60}
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
