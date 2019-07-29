"use strict";
/**
 * Twitter Node DApp Listener - Test Scripts 02
 * Covers ERC20 Standard Functions
 * @author: Mark Kensington
 * 
 */
const assert = require("assert");
const ERC20Token = artifacts.require("TwitterNodeDapp");
const defaults = require("./TwitterNodeDappTests-Defaults");  // Default Testing Values

contract("02 - ERC20 Standard Functions", async(accounts) => {
  it("Standard transfer", async() => {
    let instance = await ERC20Token.new();
    let alice = accounts[0];
    let bob = accounts[1];

    let result = await instance.transfer(bob, 100);
    assert.equal(result.logs[0].event, "Transfer");

    let balanceAlice = await instance.balanceOf(alice);
    assert.equal(balanceAlice.valueOf(), defaults.checkInitialSupply - 100);

    let balanceBob = await instance.balanceOf(bob);
    assert.equal(balanceBob.valueOf(), 100);
  });

  it("Transfer to address 0 should fail", async() => {
    let instance = await ERC20Token.new();

    try {
      await instance.transfer(defaults.addressZero, 100);
      assert.fail("Transfer to address 0 not allowed. Transfer should fail!");
    } catch (err) {
      assert(err.toString().includes("Invalid Transfer to address zero"), "Message: " + err);
    }
  });

  it("Transfer with no tokens should fail", async() => {
    let instance = await ERC20Token.new();
    let alice = accounts[0];
    let bob = accounts[1];

    try {
      await instance.transfer(alice, 100, {from: bob});
      assert.fail("Bob has no tokens. Transfer should fail!");
    } catch (err) {
      assert(err.toString().includes("Sender does not have enough tokens"), "Message: " + err);
    }
  });

  it("Standard approval", async() => {
    let instance = await ERC20Token.new();
    let alice = accounts[0];
    let bob = accounts[1];

    let result = await instance.approve(bob, 100);
    assert.equal(result.logs[0].event, "Approval");

    let allowance = await instance.allowance(alice, bob);
    assert.equal(allowance.valueOf(), 100);
  });

  it("Approval for address 0 should fail", async() => {
    let instance = await ERC20Token.new();

    try {
      await instance.approve(defaults.addressZero, 100);
      assert.fail("Approval for address 0 not allowed. Approval should fail!");
    } catch (err) {
      assert(err.toString().includes("Invalid Approval for address zero"), "Message: " + err);
    }
  });

  it("Standard transferFrom", async() => {
    let instance = await ERC20Token.new();
    let alice = accounts[0];
    let bob = accounts[1];
    let peter = accounts[2];

    let approval = await instance.approve(bob, 100, {from: alice});
    assert.equal(approval.logs[0].event, "Approval");

    let result = await instance.transferFrom(alice, peter, 20, {from: bob});
    assert.equal(result.logs[0].event, "Transfer");

    let allowance = await instance.allowance(alice, bob);
    assert.equal(allowance.valueOf(), 80);
  });

  it("TransferFrom with no allowance should fail", async() => {
    let instance = await ERC20Token.new();
    let alice = accounts[0];
    let bob = accounts[1];
    let peter = accounts[2];

    try {
      await instance.transferFrom(alice, peter, 100, {from: bob});
      assert.fail("Bob has no allowance from Alice. Transfer should fail!");
    } catch (err) {
      assert(err.toString().includes("Insufficient Allowance available"), "Message: " + err);
    }
  });

  it("TransferFrom with insufficient allowance should fail", async() => {
    let instance = await ERC20Token.new();
    let alice = accounts[0];
    let bob = accounts[1];
    let peter = accounts[2];

    let approval = await instance.approve(bob, 100, {from: alice});
    assert.equal(approval.logs[0].event, "Approval");

    let result = await instance.transferFrom(alice, peter, 99, {from: bob});
    assert.equal(result.logs[0].event, "Transfer");

    let allowance = await instance.allowance(alice, bob);
    assert.equal(allowance.valueOf(), 1);

    try {
      await instance.transferFrom(alice, peter, 2, {from: bob});
      assert.fail("Bob has insufficient allowance from Alice. Transfer should fail!");
    } catch (err) {
      assert(err.toString().includes("Insufficient Allowance available"), "Message: " + err);
    }
  });

  it("TransferFrom with insufficient tokens in FROM adddress should fail", async() => {
    let instance = await ERC20Token.new();
    let bob = accounts[1];
    let peter = accounts[2];
    
    let approval = await instance.approve(bob, 100, {from: peter});
    assert.equal(approval.logs[0].event, "Approval");
    
    let allowance = await instance.allowance(peter, bob);
    assert.equal(allowance.valueOf(), 100);

    try {
      await instance.transferFrom(peter, bob, 50, {from: bob});
      assert.fail("Bob HAS allowance from Peter but Peter has no tokens. Transfer should fail!");
    } catch (err) {
      assert(err.toString().includes("From Address does not have enough tokens"), "Message: " + err);
    }
  });

});
