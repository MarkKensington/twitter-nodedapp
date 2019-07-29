"use strict";
/**
 * Twitter Node DApp Listener - Test Script Defaults
 * These are the Default Values that will be checked by Test Scripts
 * Change as required based on Contract
 * @author: Mark Kensington
 */

const web3 = require("web3");
const BN = web3.utils.BN;

module.exports = {
  checkSymbol: "TND",
  checkName: "Twitter Node DApp Token",
  checkDecimals: 0,
  checkInitialSupply: 10000,
  checkIntialTweetValue: 10,
  addressZero:"0x0000000000000000000000000000000000000000",
  maxUINT256: new BN("2").pow(new BN("256")).sub(new BN("1"))
};