import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import { task } from 'hardhat/config';
import { HardhatUserConfig } from 'hardhat/types';

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (_args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: '0.8.3',
  paths: {
    artifacts: '../frontend/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ropsten:{
      url: 'https://ropsten.infura.io/v3/a38613e5838d473f9bd10b9e11245841',
      accounts: [`51d4a4fd54c086107e559fe914f8e05d8f2a2ace130ae7f21e70a71347f435f5`]
    }
  },
  typechain: {
    outDir: '../frontend/types/typechain',
  },
};

export default config;
