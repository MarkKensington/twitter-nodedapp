"use strict";
/**
 * Twitter Node DApp Listener - Test Scripts 05
 * Covers Additional Standard Functions
 * @author: Mark Kensington
 * 
 */
const assert = require("assert");
const ERC20Token = artifacts.require("TwitterNodeDapp");
const defaults = require("./TwitterNodeDappTests-Defaults");  // Default Testing Values

contract("05 - Additional Standard Functions", async(accounts) => {

  it("Standard mint", async() => {
    let instance = await ERC20Token.new();
    let contractCreator = accounts[0];

    let result = await instance.mint(contractCreator, 1000);
    assert.equal(result.logs[0].event, "Transfer");

    let balance = await instance.balanceOf(contractCreator);
    assert.equal(balance.valueOf(), defaults.checkInitialSupply + 1000);

    let totalSupply = await instance.totalSupply();
    assert.equal(totalSupply.valueOf(), defaults.checkInitialSupply + 1000);
  });

  it("Mint to address 0 should fail", async() => {
    let instance = await ERC20Token.new();

    try {
      await instance.mint(defaults.addressZero, 100);
      assert.fail("Mint to address 0 not allowed. Mint should fail!");
    } catch (err) {
      assert(err.toString().includes("Invalid Mint to address zero"), "Message: " + err);
    }
  });

  it("Mint by non-admin should fail", async() => {
    let instance = await ERC20Token.new();
    let bob = accounts[1];

    try {
      await instance.mint(bob, 100, {from: bob});
      assert.fail("Mint by non-admin not allowed. Mint should fail!");
    } catch (err) {
      assert(err.toString().includes("Admin Assignment Required: Caller is not an Admin"), "Message: " + err);
    }
  });

  it("Standard burn", async() => {
    let instance = await ERC20Token.new();
    let contractCreator = accounts[0];

    let result = await instance.burn(contractCreator, 1000);
    assert.equal(result.logs[0].event, "Transfer");

    let balance = await instance.balanceOf(contractCreator);
    assert.equal(balance.valueOf(), defaults.checkInitialSupply - 1000);

    let totalSupply = await instance.totalSupply();
    assert.equal(totalSupply.valueOf(), defaults.checkInitialSupply - 1000);
  });

  it("Burn from address 0 should fail", async() => {
    let instance = await ERC20Token.new();

    try {
      await instance.burn(defaults.addressZero, 100);
      assert.fail("Burn from address 0 not allowed. Burn should fail!");
    } catch (err) {
      assert(err.toString().includes("Invalid Burn from address zero"), "Message: " + err);
    }
  });

  it("Burn by non-admin should fail", async() => {
    let instance = await ERC20Token.new();
    let contractCreator = accounts[0];
    let bob = accounts[1];

    try {
      await instance.burn(contractCreator, 100, {from:bob});
      assert.fail("Burn by non-admin not allowed. Burn should fail!");
    } catch (err) {
      assert(err.toString().includes("Admin Assignment Required: Caller is not an Admin"), "Message: " + err);
    }
  });

  it("Burn with insufficient tokens should fail", async() => {
    let instance = await ERC20Token.new();
    let bob = accounts[1];

    try {
      await instance.burn(bob, 100);
      assert.fail("Bob has no tokens. Burn should fail!");
    } catch (err) {
      assert(err.toString().includes("Burn Address does not have enough tokens"), "Message: " + err);
    }
  });

});
