require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');
require('@openzeppelin/hardhat-upgrades');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.19',
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 10000,
          },
          metadata: {
            bytecodeHash: 'none',
          },
        },
      },
    ],
  },
  networks: {
    // 网络
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/rhaJFeiHbbllCyveEjstHVwo9ZXa_Upt`,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
      chainId: 11155111,
      timeout: 300000,
    },
    testnet: {
      url: `https://babel-api.testnet.iotex.io`,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
      chainId: 4690,
    },
    mainnet: {
      url: `https://babel-api.mainnet.iotex.io`,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
      chainId: 4689,
    }
} ,   
etherscan: {
  apiKey: "",

  customChains: [
    {
      network: "mainnet",
      chainId: 4689,
      urls: {
        apiURL: "https://IoTeXscout.io/api",
        browserURL: "https://IoTeXscan.io"
      }
    },
    {
      network: "testnet",
      chainId: 4690,
      urls: {
        apiURL: "https://testnet.IoTeXscout.io/api",
        browserURL: "https://testnet.IoTeXscan.io"
      }
    }
  ],
},
};
