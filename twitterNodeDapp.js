"use strict";
/**
 * Twitter Node DApp Listener
 * @author: Mark Kensington
 * Listens to a Twitter Stream for a specific message with an Ethereum Address &
 * when heard it processes a smart contract transaction to send tokens to that address
 */

// Set-up Environment Variables for DApp credentials and default values
const Dotenv = require("dotenv");
Dotenv.config();

// Set-up access to Twitter
const Twitter = require("twitter");
const client = new Twitter ({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Set-up ethereumjs-tx and web3
const EthereumTx = require('ethereumjs-tx').Transaction;
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_HTTP_PROVIDER));

// Load Smart Contract ABI from JSON file
const fs = require("fs");
const jsonFile = "./twitterNodeDapp_abi.json";
const contractABI = JSON.parse(fs.readFileSync(jsonFile));

// Set-up & initialise the Smart Contract
const adminPrivateKey = Buffer.from(process.env.TND_ADMIN_PRIVATE_KEY, "hex",);
const contractInstance = new web3.eth.Contract(contractABI, process.env.TND_CONTRACT_ADDRESS, {
  from: process.env.TND_ADMIN_ACCOUNT,
  gasPrice: "20000000000"  // default gas price in wei
});


// Check Smart Contract is deployed and then runStreamer
web3.eth.getCode(process.env.TND_CONTRACT_ADDRESS, (error, result) => {
  if (error) {
    console.error("Error: ", error);
  }
  if (result == "0x") {
    console.log("ERROR - Looks like your Smart Contract is not deployed!");
  } else {
    console.log(`Smart Contract deployed at address: ${process.env.TND_CONTRACT_ADDRESS}.`);
    runStreamer();
  }
});


function runStreamer() {
// Use "client.stream" to find the tweet
  let stream = client.stream("statuses/filter", {track: process.env.TND_SEARCH_STRING});
  console.log(`Twitter Node DApp Listener started.`);
  console.log(`Listening for ${process.env.TND_SEARCH_STRING}...\n`);

  stream.on("data", function(event) {
    let tweetAddress = event.text.substring(event.text.indexOf("0x"), event.text.indexOf("0x") + 42);
    console.log(`From: ${event.user.name} / Tweet Address: ${tweetAddress}`);
    console.log(`-Tweet: ${event.text}`);
    // Process a smart contract transaction
    if (web3.utils.isAddress(tweetAddress)) {
      processTweetToken(tweetAddress);
    } else {
      console.log(`-ERROR - Tweet Address is not a valid Ethereum Address!\n`);
    }
  });

  stream.on("error", function(error) {
    console.log(error);
  });
}

function processTweetToken(receiverAddress) {
  web3.eth.getTransactionCount(process.env.TND_ADMIN_ACCOUNT, (error, transactionCount) => {
    if (error) console.error(`-ERROR: ${error}\n`);
    let basicTransaction = {
      "nonce": web3.utils.toHex(transactionCount),
      "gas": web3.utils.toHex(process.env.TND_CONTRACT_GAS),
      "gasPrice": web3.utils.toHex(web3.utils.toWei(process.env.TND_CONTRACT_GAS_PRICE, "gwei")),
      "from": process.env.TND_ADMIN_ACCOUNT,
      "to": process.env.TND_CONTRACT_ADDRESS,
      "data": contractInstance.methods.tweetToken(receiverAddress).encodeABI()
    };
    let signedTransaction = new EthereumTx(basicTransaction);
    signedTransaction.sign(adminPrivateKey);
    let serializedTransaction = signedTransaction.serialize();
    let rawTransaction = "0x" + serializedTransaction.toString("hex");
    web3.eth.sendSignedTransaction(rawTransaction, (error, transactionHash) => {
      if (error) console.error(`-ERROR: ${error}\n`);
      console.log(`-Transaction #: ${transactionHash}\n`);
    });
  });
}

