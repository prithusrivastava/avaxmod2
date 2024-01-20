# Finance Management Smart Contract

This Solidity smart contract, `FinanceManagement`, provides basic functionalities for managing funds, withdrawals, and a pass key for authentication.

## Contract Details

- **Solidity Version:** 0.8.9
- **License:** UNLICENSED

## Contract State Variables

- `accOwner`: The address of the account owner (payable).
- `availableFunds`: The current balance of available funds.
- `passKey`: The pass key for authentication.

## Events

- `FundsAdded(uint256 fundAmount)`: Emitted when funds are added to the contract.
- `FundsWithdrawn(uint256 fundAmount)`: Emitted when funds are withdrawn from the contract.
- `KeyChanged(uint256 newKey)`: Emitted when the pass key is changed.

## Constructor

The contract is initialized with an initial fund amount (`initFunds`) and a pass key (`key`). The owner of the contract is set to the sender of the transaction.

```solidity
constructor(uint256 initFunds, uint256 key) payable {
    // Initialization logic
}
```

After cloning the github, you will want to do the following to get the code running on your computer.

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/
