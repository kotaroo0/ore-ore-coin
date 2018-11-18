var OreOreCoin = artifacts.require("./OreOreCoin.sol");
var Owned = artifacts.require("./Owned.sol");
var Members = artifacts.require("./Members.sol");

contract("OreOreCoin", async accounts => {
  it("should be correct prop name", async () => {
    let oreOreCoin = await OreOreCoin.deployed(10000, "OreOreCoin", "oc", 0);
    let name = await oreOreCoin.name();
    assert.equal(name, "OreOreCoin");
  });

  it("should be correct prop symbol", async () => {
    let oreOreCoin = await OreOreCoin.deployed(10000, "OreOreCoin", "oc", 0);
    let symbol = await oreOreCoin.symbol();
    assert.equal(symbol, "oc");
  });

  it("should be correct prop decimals", async () => {
    let oreOreCoin = await OreOreCoin.deployed(10000, "OreOreCoin", "oc", 0);
    let decimals = await oreOreCoin.decimals();
    assert.equal(decimals, 0);
  });

  it("should be correct prop totalSupply", async () => {
    let oreOreCoin = await OreOreCoin.deployed(10000, "OreOreCoin", "oc", 0);
    let totalSupply = await oreOreCoin.totalSupply();
    assert.equal(totalSupply, 10000);
  });

  it("should be correct prop balanceOf", async () => {
    let oreOreCoin = await OreOreCoin.deployed(10000, "OreOreCoin", "oc", 0);
    let balanceOf = await oreOreCoin.balanceOf.call(accounts[0]);
    assert.equal(balanceOf, 10000);
  });

  it("should send conin correctly", async () => {
    let oreOreCoin = await OreOreCoin.deployed(10000, "OreOreCoin", "oc", 0);

    let account1 = accounts[0];
    let account2 = accounts[1];

    let amount = 100;

    let beforeBalanceOfAccount1 = await oreOreCoin.balanceOf.call(account1);
    let before_balance_of_account2 = await oreOreCoin.balanceOf.call(account2);
    await oreOreCoin.transfer(account2, amount);
    let afterBalanceOfAccount1 = await oreOreCoin.balanceOf.call(account1);
    let after_balance_of_account2 = await oreOreCoin.balanceOf.call(account2);

    assert.equal(
      afterBalanceOfAccount1.toNumber(),
      beforeBalanceOfAccount1.toNumber() - amount
    );
    assert.equal(
      after_balance_of_account2.toNumber(),
      before_balance_of_account2.toNumber() + amount
    );

    // ブラックリストに関するテスト
    // 送金を受け取ることができない
    oreOreCoin.blacklisting(account2);
    await oreOreCoin.transfer(account2, amount);
    let balanceOfaccount2 = await oreOreCoin.balanceOf.call(account2);
    assert.equal(
      balanceOfaccount2.toNumber(),
      after_balance_of_account2.toNumber()
    );

    // ブラックリストから削除する
    oreOreCoin.deletedFromBlacklist(account2);
    oreOreCoin.transfer(account2, amount);
    let balanceOfaccount2After = await oreOreCoin.balanceOf.call(account2);
    assert.equal(
      balanceOfaccount2After.toNumber(),
      balanceOfaccount2.toNumber() + amount
    );
  });

  it.skip("should func member feature", async () => {
    // TODO: ユーザーを変えてテスト

    let oreOreCoin = await OreOreCoin.deployed(10000, "OreOreCoin", "oc", 0);
    let owned = await Owned.deployed();
    let members = await Members.deployed();

    let account1 = accounts[0];
    let account2 = accounts[1];

    initial_owner = await members.owner();
    assert.equal(initial_owner, account1);

    await members.pushStatus("gold", 15, 1500, 10);
    await members.pushStatus("silver", 5, 500, 5);
    await members.pushStatus("bronze", 0, 0, 0);

    await members.transferOwnership(account2);
  });

  it.skip("should get cashback", async () => {
    // TODO: ユーザーを変えてテスト
  });
});
