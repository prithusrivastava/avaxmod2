// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract FinanceManagement {
    address payable public accOwner;
    uint256 public availableFunds;
    uint256 public passKey;

    event FundsAdded(uint256 fundAmount);
    event FundsWithdrawn(uint256 fundAmount);
    event KeyChanged(uint256 newKey);

    constructor(uint256 initFunds, uint256 key) payable {
        availableFunds = initFunds;
        accOwner = payable(msg.sender);
        passKey = key;
    }

    function addBalance(uint256 fundAmount) public payable {
        require(msg.sender == accOwner, "You are not the account owner");
        uint256 previousFunds = availableFunds;
        availableFunds += fundAmount;
        assert(availableFunds == previousFunds + fundAmount);
        emit FundsAdded(fundAmount);
    }

    function getAccFunds() public view returns (uint256) {
        return availableFunds;
    }

    error lowFunds(uint256 balance, uint256 withdrawalAmount);

    function withdraw(uint256 withdrawalAmount) public {
        require(msg.sender == accOwner, "You are not owner");
        uint256 previousFunds = availableFunds;
        if (availableFunds < withdrawalAmount) {
            revert lowFunds({
                balance: availableFunds,
                withdrawalAmount: withdrawalAmount
            });
        }
        availableFunds -= withdrawalAmount;
        assert(availableFunds == (previousFunds - withdrawalAmount));
        emit FundsWithdrawn(withdrawalAmount);
    }

    function changePassKey(uint256 newKey) public {
        require(msg.sender == accOwner, "You are not the account owner");
        passKey = newKey;
        emit KeyChanged(newKey);
    }

    function getPassKey() public view returns (uint256) {
        require(msg.sender == accOwner, "You are not the account owner");
        return passKey;
    }
}
