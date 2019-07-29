"use strict";
/**
 * Twitter Node DApp Listener - Test Scripts 03
 * Covers SafeMath Functions
 * @author: Mark Kensington
 * @dev NOTE: These tests require the testAdd & testSub functions from TwitterNodeDapp.sol
 * @dev to be un-commented in order to expose the intgernal library functions
 * 
 */
const assert = require("assert");
const ERC20Token = artifacts.require("TwitterNodeDapp");
const defaults = require("./TwitterNodeDappTests-Defaults");  // Default Testing Values

contract("03 - SafeMath Functions", async() => {

  it("Standard addition", async() => {
    let instance = await ERC20Token.new();
    
    let result = await instance.testAdd(2, 3);
    assert.equal(result.valueOf(), 5);
  });

  it("Addition overflow should fail", async() => {
    let instance = await ERC20Token.new();

    try {
      await instance.testAdd(defaults.maxUINT256, 1);
      assert.fail("Overflow not allowed. Addition should fail!");
    } catch (err) {
      assert(err.toString().includes("SafeMath: addition overflow"), "Message: " + err);
    }
  });

  it("Standard subtraction", async() => {
    let instance = await ERC20Token.new();

    let result = await instance.testSub(5, 3);
    assert.equal(result.valueOf(), 2);
  });

  it("Subtraction results in negative number should fail", async() => {
    let instance = await ERC20Token.new();

    try {
      await instance.testSub(1, 2);
      assert.fail("Subtraction to negative value not allowed. Subtraction should fail!");
    } catch (err) {
      assert(err.toString().includes("SafeMath: subtraction overflow"), "Message: " + err);
    }
  });

});
