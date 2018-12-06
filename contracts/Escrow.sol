pragma solidity ^0.4.8;

import "./Owned.sol";
import "./Members.sol";
import "./OreOreCoin.sol";

contract Escrow is Owned {
    OreOreCoin public token;
    uint256 public salesVolume;
    uint256 public sellingPrice;
    uint256 public deadline;
    bool public isOpened;

    event EscrowStart(uint salesVolume, uint sellingPrice, uint deadline, address beneficiary);
    event ConfirmedPayment(address addr, uint amount);

    constructor(OreOreCoin _token, uint256 _salesVolume, uint256 _priceInEther) public {
        token = OreOreCoin(_token);
        salesVolume = _salesVolume;
        sellingPrice = _priceInEther * 1 ether;
    }

    function () payable public {
        require(isOpened && now < deadline);

        uint amount = msg.value;
        require(amount >= sellingPrice);

        token.transfer(msg.sender, salesVolume);
        isOpened = false;
        emit ConfirmedPayment(msg.sender, amount);
    }

    function start(uint256 _durationInMinutes) onlyOwner public {
        require(token != address(0) && salesVolume != 0 && sellingPrice != 0 && deadline == 0);

        if (token.balanceOf(this) >= salesVolume) {
            deadline = now + _durationInMinutes * 1 minutes;
            isOpened = true;
            emit EscrowStart(salesVolume, sellingPrice, deadline, owner);
        }
    }

    function getRemainingTime() constant public returns(uint min) {
        if (now < deadline) {
            min = (deadline - now) / (1 minutes);
        }
    }

    function close() onlyOwner public {
        token.transfer(owner, token.balanceOf(this));
        selfdestruct(owner);
    }
}
