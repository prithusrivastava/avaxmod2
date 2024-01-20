const hre = require("hardhat");

async function main() {
  const initBalance = 1000;
  const _pin = 1001;

  const Assessment = await hre.ethers.getContractFactory("FinanceManagement");
  const assessment = await Assessment.deploy(initBalance, _pin);
  await assessment.deployed();

  console.log(
    `A contract with balance of ${initBalance} ETH and PIN ${_pin} deployed to ${assessment.address}`
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
