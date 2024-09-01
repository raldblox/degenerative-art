export const contractDeployments = {
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
      address: "0x5F440745E21D2F0388F7360586e8d92a9058BccC",
    },
    mood: {
      address: "0xd08b30c1eda1284cd70e73f29ba27b5315acc3f9",
    },
    theme: {
      Minimalist: "0x8dc9c31AC117b29396399C2C8031b99B1af59457",
      Graffiti: "0x749cc8541c06BBC9De0CD0373fCEF70B6373c6Ee",
    },
  },
  // polygonAmoy: {
  //   network: {
  //     chainId: 80002,
  //     rpcUrls: ["https://rpc-amoy.polygon.technology"],
  //     chainName: "Polygon Amoy",
  //     nativeCurrency: {
  //       name: "MATIC",
  //       symbol: "MATIC",
  //       decimals: 18,
  //     },
  //     blockExplorerUrls: ["https://amoy.polygonscan.com"],
  //   },
  //   DegenerativesArt: {
  //     address: "0x8c737d95d463607d781292F2A261C8528a05E341",
  //     explorer:
  //       "https://www.oklink.com/amoy/address/0x8c737d95d463607d781292F2A261C8528a05E341#code",
  //   },
  //   DegenerativesVisualEngine: {
  //     address: "0x21CEe2A99BB3b3a4C639cf9aD4BBd0a932a787Ef",
  //   },
  //   MoodToken: {
  //     address: "0x3374fFc7Ab671894985961448c79844754057bB8",
  //   },
  //   NFTPricer: {
  //     address: "0x0ae1824C4e3e9806A36F1eb7E29b7d7Ae798bFbF",
  //   },
  // },
  // polygon: {
  //   network: {
  //     chainId: 137,
  //     rpcUrls: ["https://polygon-rpc.com/"],
  //     chainName: "Polygon Mainnet",
  //     nativeCurrency: {
  //       name: "MATIC",
  //       symbol: "MATIC",
  //       decimals: 18,
  //     },
  //     blockExplorerUrls: ["https://polygonscan.com/"],
  //   },
  //   DegenerativesArt: {
  //     address: "0x8CF43f4BAbe81CC7Bf9cEf3F185e9320d7FF750a",
  //     explorer:
  //       "https://polygonscan.com/address/0x8CF43f4BAbe81CC7Bf9cEf3F185e9320d7FF750a",
  //   },
  //   DegenerativesVisualEngine: {
  //     address: "0x4dF1Ef6ccE1fC1066CdccfeEC437f8630263d671",
  //   },
  // },
  // etherlinkTestnet: {
  //   network: {
  //     chainId: 128123,
  //     rpcUrls: ["https://node.ghostnet.etherlink.com"],
  //     chainName: "Etherlink Testnet",
  //     nativeCurrency: {
  //       name: "XTZ",
  //       symbol: "XTZ",
  //       decimals: 18,
  //     },
  //     blockExplorerUrls: ["https://testnet-explorer.etherlink.com"],
  //   },
  //   DegenerativesArt: {
  //     address: "0x1a4Ea0DBd57f506220B464e98495E030De27Aa4E",
  //   },
  //   DegenerativesVisualEngine: {
  //     address: "0x241DC8867c421D787de5952065e9Ef085E104e34",
  //   },
  //   mood: {
  //     address: "0xE50dFcc0048AE9EA95505E219185A092412486D8",
  //   },
  //   theme: {
  //     Minimalist: "0x362D2F28C4A77a913A91dBc32A966FbEd91CeC6d",
  //     Graffiti: "0x5709773F6f0343921B4fed01e3e228FA22EeE504",
  //   },
  // },

  // coreTestnet: {
  //   network: {
  //     chainId: 1115,
  //     chainName: "Core Blockchain Testnet",
  //     rpcUrls: ["https://rpc.test.btcs.network"],
  //     nativeCurrency: {
  //       name: "tCORE",
  //       symbol: "tCORE",
  //       decimals: 18,
  //     },
  //     blockExplorerUrls: ["https://scan.test.btcs.network"],
  //   },
  //   DegenerativesArt: {
  //     address: "0x8580862E4986BDA672Cb14271fC1Ac215Adc31E2",
  //     explorer:
  //       "https://scan.test.btcs.network/address/0x8580862E4986BDA672Cb14271fC1Ac215Adc31E2#code",
  //   },
  //   DegenerativesVisualEngine: {
  //     address: "0xCf1eb76A8B393f015C8Ac7021Ab82cA79d3e58dC",
  //   },
  // },
  // core: {
  //   network: {
  //     chainId: 1116,
  //     chainName: "Core Blockchain Mainnet",
  //     rpcUrls: ["https://rpc.coredao.org"],
  //     nativeCurrency: {
  //       name: "CORE",
  //       symbol: "CORE",
  //       decimals: 18,
  //     },
  //     blockExplorerUrls: ["https://scan.coredao.org"],
  //   },
  //   DegenerativesArt: {
  //     address: "0xBB467000b19e99d0E266866c0F05516ef1724792",
  //     explorer:
  //       "https://scan.test.btcs.network/address/0xBB467000b19e99d0E266866c0F05516ef1724792#code",
  //   },
  //   DegenerativesVisualEngine: {
  //     address: "0xd447F6f5a180b927d7a36EF3e81912A4420a0F49",
  //   },
  // },
  // base: {
  //   network: {
  //     chainId: 8453,
  //     chainName: "Base Mainnet",
  //     rpcUrls: ["https://mainnet.base.org"],
  //     nativeCurrency: {
  //       name: "ETH",
  //       symbol: "ETH",
  //       decimals: 18,
  //     },
  //     blockExplorerUrls: ["https://base.blockscout.com/"],
  //   },
  //   DegenerativesArt: {
  //     address: "",
  //     explorer:
  //       "https://scan.test.btcs.network/address/0xBB467000b19e99d0E266866c0F05516ef1724792#code",
  //   },
  //   DegenerativesVisualEngine: {
  //     address: "",
  //   },
  // },
};
