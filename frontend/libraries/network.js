export const networks = [
  {
    chainId: 42793,
    rpcUrls: ["https://node.mainnet.etherlink.com"],
    chainName: "Etherlink",
    nativeCurrency: {
      name: "XTZ",
      symbol: "XTZ",
      decimals: 18,
    },
    blockExplorerUrls: ["https://explorer.etherlink.com"],
    icon: "./chains/etherlink.svg",
  },
  {
    chainId: 137,
    rpcUrls: ["https://polygon.llamarpc.com"],
    chainName: "Polygon",
    nativeCurrency: {
      name: "POL",
      symbol: "POL",
      decimals: 18,
    },
    blockExplorerUrls: ["https://polygonscan.com/"],
    icon: "./chains/polygon.png",
  },
  {
    chainId: 8453,
    chainName: "Base",
    rpcUrls: ["https://mainnet.base.org"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://base.blockscout.com/"],
    icon: "./chains/base.png",
  },
  {
    chainId: 1116,
    chainName: "Core",
    rpcUrls: ["https://rpc.coredao.org"],
    nativeCurrency: {
      name: "CORE",
      symbol: "CORE",
      decimals: 18,
    },
    blockExplorerUrls: ["https://scan.coredao.org"],
    icon: "./chains/coredao.svg",
  },
  {
    chainId: 42161,
    chainName: "Arbitrum One",
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://arbiscan.io"],
    icon: "./chains/arbitrum.svg",
  },
  {
    chainId: 56,
    chainName: "BNB Chain",
    rpcUrls: ["https://binance.llamarpc.com"],
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    blockExplorerUrls: ["https://bscscan.com"],
    icon: "./chains/bnb.svg",
  },
];
