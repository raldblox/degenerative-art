export const networks = [
  {
    isLive: true,
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
    site: "https://etherlink.com",
    contracts: {
      moodArt: "0x5F440745E21D2F0388F7360586e8d92a9058BccC",
      moodBank: "0xD37D8659153aC1b43704031abBE0266C8F04E8Ed",
    },
    marketplaces: [
      {
        name: "Rarible",
        icon: "",
        link: "",
      },
    ],
  },
  {
    isLive: true,
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
    site: "https://coredao.org",
    contracts: {
      moodArt: "0x91a8c5Ce0bD41488351640564baE4C8d7D8e00BD",
      moodBank: "0xD37D8659153aC1b43704031abBE0266C8F04E8Ed",
    },
    marketplaces: [
      {
        name: "YoungParrot",
        icon: "./icons/youngparrot.jpg",
        link: "https://app.youngparrotnft.com/core/assets",
      },
    ],
  },
  {
    isLive: true,
    chainId: 137,
    rpcUrls: ["https://polygon.llamarpc.com", "https://polygon-rpc.com/"],
    chainName: "Polygon",
    nativeCurrency: {
      name: "POL",
      symbol: "POL",
      decimals: 18,
    },
    blockExplorerUrls: ["https://polygonscan.com"],
    icon: "./chains/polygon.png",
    site: "https://polygon.technology/",
    contracts: {
      moodArt: "0x957f319210eCC12B9bBbE38ea6B1e92E2748dB6c",
      moodBank: "0x2aB32741dc8453714136bBaFD2D6A5ec77934E23",
    },
    marketplaces: [
      {
        name: "Rarible",
        icon: "./rarible.svg",
        link: "https://rarible.com/token",
      },
      {
        name: "Opensea",
        icon: "./icons/opensea.svg",
        link: "https://opensea.io/assets",
      },
    ],
  },
  {
    isLive: true,
    chainId: 8453,
    chainName: "Base",
    rpcUrls: ["https://mainnet.base.org", "https://base.llamarpc.com"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://basescan.org"],
    icon: "./chains/base.png",
    site: "https://base.org",
    contracts: {
      moodArt: "0xBF28585d32faEAf2F58E9Ab15966989f49C3dFfa",
      moodBank: "0xF8fe97f8a779b08a7af2A9d9B86ac393f87B8c55",
    },
    marketplaces: [
      {
        name: "Rarible",
        icon: "./rarible.svg",
        link: "https://rarible.com/token",
      },
      {
        name: "Opensea",
        icon: "./icons/opensea.svg",
        link: "https://opensea.io/assets",
      },
      {
        name: "MagicEden",
        icon: "./magiceden.png",
        link: "https://magiceden.io/item-details",
      },
    ],
  },

  {
    isLive: false,
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
    site: "https://arbitrum.io",
  },
  {
    isLive: false,
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
    site: "https://bnbchain.org",
  },
  {
    isLive: false,
    chainId: 10,
    chainName: "OP Mainnet",
    rpcUrls: ["https://mainnet.optimism.io"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
    icon: "./chains/optimism.svg",
    site: "https://optimism.io",
  },
  {
    isLive: false,
    chainId: 1946,
    chainName: "Soneium Minato",
    rpcUrls: ["https://optimistic.etherscan.io"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://explorer-testnet.soneium.org"],
    icon: "./chains/soneium.svg",
    site: "https://soneium.org",
  },
];
