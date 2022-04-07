require("@nomiclabs/hardhat-waffle");
const projectId = "338748305bac46e7bc0437a0a790e08b";
const fs = require('fs');
const path = require('path');
// const privateKey = fs.readdirSync(".secret").toString();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    // mumbai: {
    //   url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
    //   accounts: [privateKey]
    // },
    // mainnet: {
    //   url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
    //   accounts: [privateKey]
    // }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
