require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    polygon: {
      name: "Polygon Mainnet",
      url: process.env.POLYGON_RPC,
      accounts: [process.env.OCVLABS_PRIVATE_KEY],
      gasPrice: "auto",
    },
    polygonAmoy: {
      name: "Polygon Amoy",
      url: "https://rpc-amoy.polygon.technology",
      accounts: [process.env.OCVLABS_PRIVATE_KEY],
      gasPrice: "auto",
    },
    coreTestnet: {
      name: "Core Blockchain Testnet",
      url: "https://rpc.test.btcs.network",
      accounts: [process.env.OCVLABS_PRIVATE_KEY],
      chainId: 1115,
    },
    coreMainnet: {
      name: "Core Blockchain Mainnet",
      url: "https://rpc.coredao.org",
      accounts: [process.env.OCVLABS_PRIVATE_KEY],
      chainId: 1116,
    },
    etherlinkTestnet: {
      name: "Etherlink Testnet",
      url: "https://node.ghostnet.etherlink.com",
      accounts: [process.env.OCVLABS_PRIVATE_KEY],
    },
    etherlinkMainnet: {
      name: "Etherlink Mainnet",
      url: "https://node.mainnet.etherlink.com",
      accounts: [process.env.OCVLABS_PRIVATE_KEY],
    },
  },
  sourcify: {
    enabled: false,
  },
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGON_ETHERSCAN,
      polygonAmoy: process.env.OKLINK_AMOY_API,
      coreTestnet: process.env.CORE_TESTNET_API,
      coreMainnet: process.env.CORE_MAINNET_API,
    },
    customChains: [
      {
        network: "coreTestnet",
        chainId: 1115,
        urls: {
          apiURL: "https://api.test.btcs.network/api",
          browserURL: "https://scan.test.btcs.network/",
        },
      },
      {
        network: "coreMainnet",
        chainId: 1116,
        urls: {
          apiURL: "https://openapi.coredao.org/api",
          browserURL: "https://scan.coredao.org/",
        },
      },
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL:
            "https://www.oklink.com/api/explorer/v1/contract/verify/async/api/polygonAmoy",
          browserURL: "https://www.oklink.com/polygonAmoy",
        },
      },
    ],
  },
};
