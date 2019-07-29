"use strict";
/**
 * Twitter Node DApp Listener - Test Scripts 01
 * Covers Contract Set-up
 * @author: Mark Kensington
 * 
 */
const assert = require("assert");
const ERC20Token = artifacts.require("TwitterNodeDapp");
const defaults = require("./TwitterNodeDappTests-Defaults");  // Default Testing Values

contract("01 - Contract Set-up", async(accounts) => {

  it("Basic ERC20 Properties (symbol, name, decimals)", async() => {
    let instance = await ERC20Token.new();

    let symbol = await instance.symbol();
    assert.equal(symbol, defaults.checkSymbol);

    let name = await instance.name();
    assert.equal(name, defaults.checkName);

    let decimals = await instance.decimals();
    assert.equal(decimals, defaults.checkDecimals);
  });

  it("Contract does not accept ETH", async() => {
    let instance = await ERC20Token.new();
    let bob = accounts[1];

    try {
      await instance.sendTransaction({from: bob, value: 1000000000000000000});
      assert.fail("Contract does not accept Ether. Transaction should fail!");
    } catch (err) {
      assert(err.toString().includes("Fallback method not allowed"), "Message: " + err);
    }
  });

  it("Initial totalSupply", async() => {
    let instance = await ERC20Token.new();

    let totalSupply = await instance.totalSupply();
    assert.equal(totalSupply.valueOf(), defaults.checkInitialSupply);
  });

  it("Initial balance and balanceOf", async() => {
    let instance = await ERC20Token.new();
    let contractCreator = accounts[0];
    let bob = accounts[1];

    let balance = await instance.balanceOf(contractCreator);
    assert.equal(balance.valueOf(), defaults.checkInitialSupply);

    balance = await instance.balanceOf(bob);
    assert.equal(balance.valueOf(), 0); 
  });

  it("Initial admin assignment", async() => {
    let instance = await ERC20Token.new();
    let contractCreator = accounts[0];

    let admin = await instance.isAdmin(contractCreator);
    assert.equal(admin, true);
  });

  it("Initial tweetValue", async() => {
    let instance = await ERC20Token.new();

    let tweetValue = await instance.tweetValue();
    assert.equal(tweetValue, defaults.checkIntialTweetValue);
  });

});
