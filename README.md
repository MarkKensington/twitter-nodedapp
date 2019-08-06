# twitter-nodedapp
Ethereum DApp using node.js to listen for Twitter tweets and interact with a smart contract to send tokens to the tweeted Ethereum address.

#### Status: Working, with a smart contract deployed on the Rinkeby test network

## Prerequisites

- [npm](https://www.npmjs.com/) and [node.js](https://nodejs.org/)
- A [Twitter developer account ](https://developer.twitter.com/en.html) required for accessing the Twitter API's
- An [Infura account](https://infura.io/) or access to a local Ethereum Node, in order to deploy and interact with the smart contract
- [Truffle](https://www.trufflesuite.com/truffle) required for compiling, testing and deploying the smart contracts ([Mocha](https://mochajs.org/) was also required to run the tests)
- [Ganache-CLI](https://www.npmjs.com/package/ganache-cli) required to set-up a personal Ethereum Blockchain for testing (can also be run on [Ganache for Windows](https://www.trufflesuite.com/ganache))
- Note: In addition, the [Windows Build Tools](https://www.npmjs.com/package/windows-build-tools) package was required (use `sudo apt-get install build-essential` on Ubuntu) and [node-gyp](https://www.npmjs.com/package/node-gyp) tools were also required

## Node Modules
This application uses the following node.js modules:

- [dotenv](https://www.npmjs.com/package/dotenv) - Used for loading configuration details from environment variables
- [ethereumjs-common](https://www.npmjs.com/package/ethereumjs-common) and [ethereumjs-tx](https://www.npmjs.com/package/ethereumjs-tx) - Used for preparing signed Ethereum transactions
- [truffle-hdwallet-provider](https://www.npmjs.com/package/truffle-hdwallet-provider) - Used by Truffle during contract deployment
- [twitter](https://www.npmjs.com/package/twitter) - Twitter API client library used to connect to Twitter
- [web3](https://github.com/ethereum/web3.js) - Ethereum JavaScript API Libary used to interact with an Ethereum node
- [solidity-coverage](https://www.npmjs.com/package/solidity-coverage) - Used during development to confirm all smart contract functions have test scripts

## Project structure
```powershell
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
1. Ensure the prerequisites above are completed. Open a terminal window, navigate to the directory required and `git clone` the twitter-nodedapp repository into a local sub-directory
2.  Change to the directory using `cd twitter-nodedapp` and run `npm install` to load the required **npm** modules. (Note: This may error on an optional dependency and provide a security vulnerability  warning, both of which can be ignored)

## Running Tests & Coverage Reports
The Truffle tests can be run at this stage if required, as follows:
* Edit the `\contracts\TwitterNodeDapp.sol` smart contract and un-comment the `testAdd()` and `testSub()` functions at the end of the contract (these are used just for testing purposes)
* Open a terminal window, change to your project directory and start a Ganache local test node using `ganache-cli`
* From another terminal window, change to your project directory and copy the .env_ToDo file to .env
* Then enter `npm run test`. This will compile the contract, deploy it to Ganache and then run the test suite
* To run the Solidity-Coverage report to confirm all functions are tested, in the `ganache-cli` terminal windows exit the Ganache node and start the Coverage node using `npx testrpc-sc --port 8555 --gasLimit 17592186044415`.  Then from the test terminal window run  `npm  run coverage` which will produce the coverage reports under the \coverage directory
* Remember to re-comment the `testAdd()` and `testSub()` functions in the smart contract before deploying it a live network

## Deploying the Smart Contract
Assuming the smart contract is not already deployed, it can be deployed using [Remix](https://remix.ethereum.org/) or using the `truffle deploy` functionality.

The values for the ERC token name, symbol and decimals are hard-coded into the TwitterNodeDapp.sol contract file and can be changed if required prior to deployment. The file also contains the initialSupply and initialTweetValue (amount of tokens sent with each tweet) initial values which can also be changed if needed.

To deploy using Truffle then a `.env` file will need to be created/updated (see below) to include the Ethereum Private Key (under TND_ADMIN_PRIVATE_KEY and without any 0x prefix) and the connection details to an Ethereum Node either locally or via Infura (under WEB3_HTTP_PROVIDER).

## Running the twitterNodeDapp listener

1. Copy the `.env_ToDo` file to `.env` and then edit the `.env` file and overwrite all the <FILL IN> entries. These include your Twitter Developer App keys, Smart Contract Account Details. You can also set your WEB3_CONNECTION to either "HTTP" for connecting to Infura or "IPC" for connecting to a locally running node. Finally, you can update the search string the app will look for on Twitter.

2. From a terminal window, start the app using `node twitterNodeDapp.js`. This should start the listener. Now, when a user sends a tweet in the format `#giveMeTNDTokens` followed by their own Ethereum Address, the app will issue a Smart Contract transaction which will transfer 10 tokens (unless changed) to their address

## Future Ideas
- Add in a Max Supply
- Add in a Self-Destruct
- Look at adding in a Proxy
