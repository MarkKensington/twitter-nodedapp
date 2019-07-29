"use strict";
/**
 * Twitter Node DApp Listener - Test Scripts 06
 * Covers Additional Contract-Specific Functions
 * @author: Mark Kensington
 * 
 */
const assert = require("assert");
const ERC20Token = artifacts.require("TwitterNodeDapp");
const defaults = require("./TwitterNodeDappTests-Defaults");  // Default Testing Values

contract("06 - Additional Contract-Specific Functions", async(accounts) => {

  it("Standard tweetToken", async() => {
    let instance = await ERC20Token.new();
    let contractCreator = accounts[0];
    let bob = accounts[1];

    let result = await instance.tweetToken(bob);
    assert.equal(result.logs[0].event, "Transfer");

    let balanceBob = await instance.balanceOf(bob);
    assert.equal(balanceBob.valueOf(), defaults.checkIntialTweetValue);

    let balanceCreator = await instance.balanceOf(contractCreator);
    assert.equal(balanceCreator.valueOf(), defaults.checkInitialSupply - defaults.checkIntialTweetValue);

    let totalSupply = await instance.totalSupply();
    assert.equal(totalSupply.valueOf(), defaults.checkInitialSupply);
  });

  it("TweetToken to address 0 should fail", async() => {
    let instance = await ERC20Token.new();

    try {
      await instance.tweetToken(defaults.addressZero);
      assert.fail("TweetToken to address 0 not allowed. TweetToken should fail!");
    } catch (err) {
      assert(err.toString().includes("Invalid Transfer to address zero"), "Message: " + err);
    }
  });

  it("TweetToken by non-admin should fail", async() => {
    let instance = await ERC20Token.new();
    let bob = accounts[1];

    try {
      await instance.tweetToken(bob, {from: bob});
      assert.fail("TweetToken by non-admin not allowed. TweetToken should fail!");
    } catch (err) {
      assert(err.toString().includes("Admin Assignment Required: Caller is not an Admin"), "Message: " + err);
    }
  });

  it("TweetToken with insufficient tokens should fail", async() => {
    let instance = await ERC20Token.new();
    let bob = accounts[1];

    let result = await instance.transfer(bob, defaults.checkInitialSupply);
    assert.equal(result.logs[0].event, "Transfer");

    try {
      await instance.tweetToken(bob);
      assert.fail("TweetToken with insufficient tokens not allowed. TweetToken should fail!");
    } catch (err) {
      assert(err.toString().includes("Need to mint more tokens"), "Message: " + err);
    }
  });

  it("Standard setTweetValue", async() => {
    let instance = await ERC20Token.new();
    
    let result = await instance.setTweetValue(20);
    assert.equal(result.logs[0].event, "TweetValueSet");
  });

  it("SetTweetValue by non-admin should fail", async() => {
    let instance = await ERC20Token.new();
    let bob = accounts[1];

    try {
      await instance.setTweetValue(30, {from: bob});
      assert.fail("SetTweetValue by non-admin not allowed. SetTweetValue should fail!");
    } catch (err) {
      assert(err.toString().includes("Admin Assignment Required: Caller is not an Admin"), "Message: " + err);
    }
  });
  
});
