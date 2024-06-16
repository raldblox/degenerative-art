export const contractDeployments = {
  polygonAmoy: {
    network: {
      chainId: 80002,
      rpcUrls: ["https://rpc-amoy.polygon.technology"],
      chainName: "Polygon Amoy",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      blockExplorerUrls: ["https://amoy.polygonscan.com"],
    },
    DegenerativesArt: {
      address: "0x8D76Ac17DCD79A54bCFD06c57B093E9cb746603C",
      explorer:
        "https://www.oklink.com/amoy/address/0x8D76Ac17DCD79A54bCFD06c57B093E9cb746603C#code",
    },
    DegenerativesVisualEngine: {
      address: "0x4dF1Ef6ccE1fC1066CdccfeEC437f8630263d671",
    },
  },
  polygon: {
    network: {
      chainId: 137,
      rpcUrls: ["https://polygon-rpc.com/"],
      chainName: "Polygon Mainnet",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      blockExplorerUrls: ["https://polygonscan.com/"],
    },
    DegenerativesArt: {
      address: "0x8CF43f4BAbe81CC7Bf9cEf3F185e9320d7FF750a",
      explorer:
        "https://polygonscan.com/address/0x8CF43f4BAbe81CC7Bf9cEf3F185e9320d7FF750a",
    },
    DegenerativesVisualEngine: {
      address: "0x4dF1Ef6ccE1fC1066CdccfeEC437f8630263d671",
    },
  },
  etherlinkTestnet: {
    network: {
      chainId: 128123,
      rpcUrls: ["https://node.ghostnet.etherlink.com"],
      chainName: "Etherlink Testnet",
      nativeCurrency: {
        name: "XTZ",
        symbol: "XTZ",
        decimals: 18,
      },
      blockExplorerUrls: ["https://testnet-explorer.etherlink.com"],
    },
    DegenerativesArt: {
      address: "0xBa12123e7B3ADb108392071739452F8114b4aAc2",
    },
    DegenerativesVisualEngine: {
      address: "0x241DC8867c421D787de5952065e9Ef085E104e34",
    },
  },
  etherlink: {
    network: {
      chainId: 42793,
      rpcUrls: ["https://node.mainnet.etherlink.com"],
      chainName: "Etherlink Mainnet",
      nativeCurrency: {
        name: "XTZ",
        symbol: "XTZ",
        decimals: 18,
      },
      blockExplorerUrls: ["https://etherlink.blockscout.com"],
    },
    DegenerativesArt: {
      address: "0x2b4Bf9C5A75BdF4D4D5BeBDdED5d894027cE777e",
    },
    DegenerativesVisualEngine: {
      address: "0xcF4352f3E9DcE4f20c3d49607E9815dbfD7e0c00",
    },
  },
  coreTestnet: {
    network: {
      chainId: 1115,
      chainName: "Core Blockchain Testnet",
      rpcUrls: ["https://rpc.test.btcs.network"],
      nativeCurrency: {
        name: "tCORE",
        symbol: "tCORE",
        decimals: 18,
      },
      blockExplorerUrls: ["https://scan.test.btcs.network"],
    },
    DegenerativesArt: {
      address: "0x8580862E4986BDA672Cb14271fC1Ac215Adc31E2",
      explorer:
        "https://scan.test.btcs.network/address/0x8580862E4986BDA672Cb14271fC1Ac215Adc31E2#code",
    },
    DegenerativesVisualEngine: {
      address: "0xCf1eb76A8B393f015C8Ac7021Ab82cA79d3e58dC",
    },
  },
  core: {
    network: {
      chainId: 1116,
      chainName: "Core Blockchain Mainnet",
      rpcUrls: ["https://rpc.coredao.org"],
      nativeCurrency: {
        name: "CORE",
        symbol: "CORE",
        decimals: 18,
      },
      blockExplorerUrls: ["https://scan.coredao.org"],
    },
    DegenerativesArt: {
      address: "0xBB467000b19e99d0E266866c0F05516ef1724792",
      explorer:
        "https://scan.test.btcs.network/address/0xBB467000b19e99d0E266866c0F05516ef1724792#code",
    },
    DegenerativesVisualEngine: {
      address: "0xd447F6f5a180b927d7a36EF3e81912A4420a0F49",
    },
  },
};
