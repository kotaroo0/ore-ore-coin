var Members = artifacts.require("./Members.sol");

contract("Members", async accounts => {
  it("should set coin", async () => {
    let members = await Members.deployed();

    await members.setCoin("0x0000000000000000000000000123456789abcdef");
    coin = await members.coin();
    assert.equal(coin, "0x0000000000000000000000000123456789abcdef");
  });
  it("should manage status", async () => {
    let members = await Members.deployed();

    // pushStatus
    await members.pushStatus("gold", 15, 1500, 10);
    await members.pushStatus("silver", 5, 500, 5);
    await members.pushStatus("bronze", 0, 0, 0);
    gold_status = await members.status.call(0);
    assert.equal(gold_status[0], "gold");
    assert.equal(gold_status[1]["c"], 15);
    silver_status = await members.status.call(1);
    assert.equal(silver_status[0], "silver");
    assert.equal(silver_status[2]["c"], 500);

    // editStatus
    await members.editStatus(2, "normal", 0, 0, 0);
    normal_status = await members.status.call(2);
    assert.equal(normal_status[0], "normal");
    assert.equal(normal_status[3]["c"], 0);
  });
});
