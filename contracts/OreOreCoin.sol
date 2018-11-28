pragma solidity ^0.4.23;

import "./Owned.sol";
import "./Members.sol";


contract OreOreCoin is Owned {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    mapping (address => uint256) public balanceOf;
    mapping (address => int8) public blackList;
    mapping (address => Members) public members;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Blacklisted(address indexed  target);
    event DeleteFromBlacklist(address indexed  target);
    event RejectedPaymentToBlacklistedAddr(address indexed from, address indexed to, uint256 value);
    event RejectedPaymentFromBlacklistedAddr(address indexed from, address indexed to, uint256 value);
    event SetCashback(address indexed addr, int8 rate);
    event Cashback(address indexed from, address indexed to, uint256 value);

    constructor(uint256 _supply, string _name, string _symbol, uint8 _decimals) public {
        balanceOf[msg.sender] = _supply;
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _supply;
    }

    function blacklisting(address _addr) public onlyOwner {
        blackList[_addr] = 1;
        emit Blacklisted(_addr);
    }

    function deletedFromBlacklist(address _addr) public onlyOwner {
        blackList[_addr] = -1;
        emit DeleteFromBlacklist(_addr);
    }

    function setMembers(Members _members) public {
        members[msg.sender] = Members(_members);
    }

    function transfer(address _to, uint256 _value) public {
        require(balanceOf[msg.sender] >= _value);
        require(balanceOf[_to] + _value >= balanceOf[_to]);

        if (blackList[msg.sender] > 0){
            emit RejectedPaymentFromBlacklistedAddr(msg.sender, _to, _value);
        } else if (blackList[_to] > 0) {
            emit RejectedPaymentToBlacklistedAddr(msg.sender, _to, _value);
        }else{

            uint256 cashback = 0;
            if(members[_to] > address(0)) {
                cashback = _value / 100 * uint256(members[_to].getCashbackRate(msg.sender));
                members[_to].updateHistory(msg.sender, _value);
            }

            balanceOf[msg.sender] -= (_value - cashback);
            balanceOf[_to] += (_value - cashback);

            emit Transfer(msg.sender, _to, _value);
            emit Cashback(_to, msg.sender, cashback);
        }
    }
}

