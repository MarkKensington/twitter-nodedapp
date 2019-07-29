"use strict";
/**
 * Twitter Node DApp Listener - Test Scripts 04
 * Covers Admin Functions
 * @author: Mark Kensington
 * 
 */
const assert = require("assert");
const ERC20Token = artifacts.require("TwitterNodeDapp");

contract("04 - Admin Functions", async(accounts) => {

  it("Standard admin assignment", async() => {
    let instance = await ERC20Token.new();
    let bob = accounts[1];

    let result = await instance.addAdmin(bob);
    assert.equal(result.logs[0].event, "AdminAdded");

    let admin = await instance.isAdmin(bob);
    assert.equal(admin, true);
  });

  it("Admin assignment by non-admin should fail", async() => {
    let instance = await ERC20Token.new();
    let bob = accounts[1];
    let peter = accounts[2];

    try {
      await instance.addAdmin(peter, {from: bob});
      assert.fail("Admin assignment by non-admin not allowed. Assignment should fail!");
    } catch (err) {
      assert(err.toString().includes("Admin Assignment Required: Caller is not an Admin"), "Message: " + err);
    }
  });

  it("Repeated admin assignment should fail", async() => {
    let instance = await ERC20Token.new();
    let bob = accounts[1];

    let resultAdd = await instance.addAdmin(bob);
    assert.equal(resultAdd.logs[0].event, "AdminAdded");

    try {
      await instance.addAdmin(bob);
      assert.fail("Repeated admin assignment not allowed. Assignment should fail!");
    } catch (err) {
      assert(err.toString().includes("Account already assigned as Admin"), "Message: " + err);
    }
  });

  it("Standard admin removal", async() => {
    let instance = await ERC20Token.new();
    let bob = accounts[1];

    let resultAdd = await instance.addAdmin(bob);
    assert.equal(resultAdd.logs[0].event, "AdminAdded");

    let resultRemove = await instance.removeAdmin(bob);
    assert.equal(resultRemove.logs[0].event, "AdminRemoved");

    let admin = await instance.isAdmin(bob);
    assert.equal(admin, false);
  });

  it("Admin removal BY non-admin should fail", async() => {
    let instance = await ERC20Token.new();
    let bob = accounts[1];
    let peter = accounts[2];

    let resultAdd = await instance.addAdmin(bob);
    assert.equal(resultAdd.logs[0].event, "AdminAdded");

    try {
      await instance.removeAdmin(bob, {from: peter});
      assert.fail("Admin removal BY non-admin not allowed. Removal should fail!");
    } catch (err) {
      assert(err.toString().includes("Admin Assignment Required: Caller is not an Admin"), "Message: " + err);
    }
  });

  it("Admin removal OF non-admin should fail", async() => {
    let instance = await ERC20Token.new();
    let bob = accounts[1];

    try {
      await instance.removeAdmin(bob);
      assert.fail("Admin removal OF non-admin not allowed. Removal should fail!");
    } catch (err) {
      assert(err.toString().includes("Account does not have Admin Assignment"), "Message: " + err);
    }
  });

});
