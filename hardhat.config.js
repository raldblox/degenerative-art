require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",

  networks: {
    polygon: {
      name: "Polygon Mainnet",
      url: process.env.POLYGON_RPC,
      accounts: [
        process.env.OCVLABS_PRIVATE_KEY,
        process.env.RELAYER_PRIVATE_KEY,
        process.env.HEXALANA_PRIVATE_KEY,
      ],
      gasPrice: "auto",
    },
    polygonAmoy: {
      name: "Polygon Amoy",
      url: "https://rpc-amoy.polygon.technology",
      accounts: [
        process.env.OCVLABS_PRIVATE_KEY,
        process.env.RELAYER_PRIVATE_KEY,
        process.env.HEXALANA_PRIVATE_KEY,
      ],
      gasPrice: "auto",
    },
    coreTestnet: {
      name: "Core Blockchain Testnet",
      url: "https://rpc.test.btcs.network",
      accounts: [
        process.env.OCVLABS_PRIVATE_KEY,
        process.env.RELAYER_PRIVATE_KEY,
        process.env.HEXALANA_PRIVATE_KEY,
      ],
      chainId: 1115,
    },
    core: {
      name: "Core",
      url: "https://rpc.coredao.org",
      accounts: [
        process.env.OCVLABS_PRIVATE_KEY,
        process.env.RELAYER_PRIVATE_KEY,
        process.env.HEXALANA_PRIVATE_KEY,
      ],
      chainId: 1116,
    },
    etherlinkTestnet: {
      name: "Etherlink Testnet",
      url: "https://node.ghostnet.etherlink.com",
      accounts: [
        process.env.OCVLABS_PRIVATE_KEY,
        process.env.RELAYER_PRIVATE_KEY,
        process.env.HEXALANA_PRIVATE_KEY,
      ],
    },
    etherlink: {
      name: "Etherlink",
      url: "https://node.mainnet.etherlink.com",
      accounts: [
        process.env.OCVLABS_PRIVATE_KEY,
        process.env.RELAYER_PRIVATE_KEY,
        process.env.HEXALANA_PRIVATE_KEY,
      ],
      gasPrice: "auto",
    },
    base: {
      name: "Base",
      url: "https://mainnet.base.org",
      accounts: [
        process.env.OCVLABS_PRIVATE_KEY,
        process.env.RELAYER_PRIVATE_KEY,
        process.env.HEXALANA_PRIVATE_KEY,
      ],
      gasPrice: "auto",
    },
    based: {
      name: "Base",
      url: "https://mainnet.base.org",
      accounts: [process.env.BTURB_PRIVATE_KEY],
      gasPrice: "auto",
    },
    "base-sepolia": {
      name: "Base Sepolia",
      url: "https://sepolia.base.org",
      accounts: [
        process.env.OCVLABS_PRIVATE_KEY,
        process.env.RELAYER_PRIVATE_KEY,
        process.env.HEXALANA_PRIVATE_KEY,
      ],
      gasPrice: 1000000000,
    },
    unichainSepolia: {
      chainId: 1301,
      name: "Unichain Sepolia",
      url: "https://sepolia.unichain.org/",
      accounts: [
        process.env.OCVLABS_PRIVATE_KEY,
        process.env.RELAYER_PRIVATE_KEY,
        process.env.HEXALANA_PRIVATE_KEY,
      ],
      gasPrice: 1000000000,
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
      etherlink: "abc",
      etherlinkTestnet: "abc",
      base: process.env.BASE_API_KEY,
      unichainSepolia: "fa49ced8-dc4b-4f1b-b190-83b3747d83bf",
    },
    customChains: [
      {
        network: "etherlink",
        chainId: 42793,
        urls: {
          apiURL: "https://explorer.etherlink.com/api",
          browserURL: "https://explorer.etherlink.com/",
        },
      },
      {
        network: "etherlinkTestnet",
        chainId: 128123,
        urls: {
          apiURL: "https://testnet.explorer.etherlink.com/api",
          browserURL: "https://testnet.explorer.etherlink.com",
        },
      },
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
          browserURL: "https://www.oklink.com/amoy",
        },
      },
      {
        network: "unichainSepolia",
        chainId: 1301,
        urls: {
          apiURL: "https://api-sepolia.uniscan.xyz/api",
          browserURL: "https://sepolia.uniscan.xyz",
        },
      },
    ],
  },
};
