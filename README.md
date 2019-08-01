# twitter-nodedapp
Ethereum DApp using NodeJS to listen for Twitter tweets and interact with a smart contract to send tokens to the tweeted Ethereum address.

#### Status: Working, with a smart contract deployed on the Rinkeby test network

## Prerequisites

- [npm](https://www.npmjs.com/) and [node.js](https://nodejs.org/)
- A [Twitter Developer account ](https://developer.twitter.com/en.html) required for accessing the Twitter API's
- An [Infura account](https://infura.io/) or access to a local Ethereum Node, in order to deploy and interact with the smart contract
- [Truffle](https://www.trufflesuite.com/truffle) for compiling, testing and deploying the smart contracts ([Mocha](https://mochajs.org/) was also required to run the tests)
- [Ganache-CLI](https://www.npmjs.com/package/ganache-cli) required to set-up a personal Ethereum Blockchain for testing (can also be run on [Ganache for Windows](https://www.trufflesuite.com/ganache))
- Note: When developing on Windows, the [Windows Build Tools](https://www.npmjs.com/package/windows-build-tools) and [node-gyp](https://www.npmjs.com/package/node-gyp) tools were also required


## Node Modules
This application uses the following node.js modules:

- [dotenv](https://www.npmjs.com/package/dotenv) - Used for loading configuration details from environment variables
- [ethereumjs-common](https://www.npmjs.com/package/ethereumjs-common) and [ethereumjs-tx] - Used for preparing signed Ethereum transactions
- [truffle-hdwallet-provider](https://www.npmjs.com/package/truffle-hdwallet-provider) - Used to sign Ethereum transactions
- [twitter](https://www.npmjs.com/package/twitter) - Twitter API client library used to connect to Twitter
- [web3](https://github.com/ethereum/web3.js) - Ethereum JavaScript API Libary used to interact with an Ethereum node
- [solidity-coverage](https://www.npmjs.com/package/solidity-coverage) - Used during development to confirm all smart contract functions have test scripts

## Project structure
```bash
twitter-nodedapp
  ├── build                   # Created by Truffle to hold the compiled smart contracts
  ├── contracts               # Contains the smart contract source files
  ├── coverage                # Created by solidity-coverage to hold the coverage report
  ├── migrations              # Used by Truffle to handle smart contract deployments
  ├── node module             # Created by NPM to hold all the Node Modules and dependencies
  ├── test                    # Contains the test scripts
  ├ .env                      # Holds the environment variables configuration details
  ├ .env_ToDo                 # Template for the .env file
  ├ truffle-config.js         # Configuration file used by Truffle
  ├ twitterNodeDapp_abi.json  # The ABI for the smart contract, required to transact with the deployed contract
  ├ twitterNodeDapp.js        # The node.js application which listens for tweets and processes transactions
  ├ ...                       # Various other configuration files used by the tools


```


## Installation and set-up
1) 

## ToDo
- Deploy/Test on Cloud Server
- Finish this readme
- Sort _localFiles

## Future Ideas
- Add in a Max Supply??
- Add in a Self-Destruct
- Look at adding in a Proxy
