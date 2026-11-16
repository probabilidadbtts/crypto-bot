require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const ALCHEMY_API_URL_SEPOLIA = process.env.ALCHEMY_API_URL_SEPOLIA || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {},
    sepolia: {
      url: ALCHEMY_API_URL_SEPOLIA,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
