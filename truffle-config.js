const path = require("path");
const HDWalletProvider = require('truffle-hdwallet-provider');

const TomoMnemonic = 'metal fancy truly hat win buddy call border insane badge fun minimum'

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    tomotestnet: {
      provider: () => new HDWalletProvider(
          TomoMnemonic,
          "https://testnet.tomochain.com",
          0,
          1,
          true,
          "m/44'/889'/0'/0/",
      ),
      network_id: "*",
      gas: 2000000,
      gasPrice: 10000000000000,  // TomoChain requires min 10 TOMO to deploy, to fight spamming attacks
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/YOUR_API_KEY")
      },
      network_id: 3,
      gas: 4000000
    }
  }
};
