var Owned = artifacts.require("./Owned.sol");

contract("Owned", async accounts => {
  it("should be correct prop owner", async () => {
    let owned = await Owned.deployed();
    let owner = await owned.owner();
    assert.equal(owner, accounts[0]);
  });

  it("should transfer ownership", async () => {
    let owned = await Owned.deployed();
    let owner = await owned.owner();
    assert.equal(owner, accounts[0]);

    await owned.transferOwnership(accounts[1]);
    new_owner = await owned.owner();
    assert.equal(new_owner, accounts[1]);
  });
});
