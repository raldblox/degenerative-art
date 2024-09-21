import { networks } from "@/libraries/network";
import { Avatar, Select, SelectItem } from "@nextui-org/react";
import React from "react";

export const SelectNetwork = () => {
  return (
    <>
      <Select
        defaultSelectedKeys={["42793"]}
        disallowEmptySelection
        selectionMode="single"
        items={networks}
        label="Select Supported Network"
        className="max-w-xs"
        variant="flat"
        classNames={{
          label: "group-data-[filled=true]:-translate-y-5",
          trigger: "min-h-20",
          listboxWrapper: "max-h-[450px]",
        }}
        listboxProps={{
          itemClasses: {
            base: [
              "rounded-md",
              "text-default-800",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "data-[hover=true]:bg-default-400",
              "dark:data-[hover=true]:bg-default-200",
              "data-[selectable=true]:focus:bg-default-200",
              "data-[pressed=true]:opacity-70",
              "data-[focus-visible=true]:ring-default-500",
            ],
          },
        }}
        popoverProps={{
          classNames: {
            base: "before:bg-default-200",
            content: "p-0 border-small border-divider bg-background",
          },
        }}
        renderValue={(items) => {
          return items.map((item) => (
            <div key={item.key} className="flex items-center gap-2">
              <Avatar
                name={item.data.nativeCurrency.symbol}
                // alt={item.data.chainName}
                className="flex-shrink-0"
                size="sm"
                src={item.data.icon}
              />
              <div className="flex flex-col">
                <span>{item.data.chainName}</span>
                <span className="text-default-500 text-tiny">
                  ({item.data.nativeCurrency.symbol})
                </span>
              </div>
            </div>
          ));
        }}
      >
        {(chain) => (
          <SelectItem key={chain.chainId} textValue={chain.chainName}>
            <div className="flex items-center gap-2">
              <Avatar
                name={chain.nativeCurrency.symbol}
                className="flex-shrink-0"
                size="sm"
                src={chain.icon}
              />
              <div className="flex flex-col">
                <span className="text-small">{chain.chainName}</span>
                <span className="text-tiny text-default-400">
                  {chain.nativeCurrency.symbol}
                </span>
              </div>
            </div>
          </SelectItem>
        )}
      </Select>
    </>
  );
};
