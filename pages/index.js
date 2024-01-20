import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import FinanceManagementABI from "../artifacts/contracts/FinanceManagement.sol/FinanceManagement.json";
import { Web3Provider } from "@ethersproject/providers";

export default function FinanceManagementApp() {
  const [ethWaller, setEthWallet] = useState(undefined);
  const [customerAcc, setCustomerAcc] = useState(undefined);
  const [financeManagementContract, setFinanceManagementContract] =
    useState(undefined);
  const [accFunds, setAccountFunds] = useState(undefined);
  const [securityPinInp, setSecurityPinInp] = useState("1234");
  const [confirmPin, setConfirmPin] = useState("");
  const [newSecurityPinInp, setNewSecurityPinInp] = useState("");

  const contractAddress = "0x2B2812a2639f0B27C1a2968eAae8eaF3B4bFB536";
  const financeManagementABI = FinanceManagementABI.abi;

  const getEthWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWaller) {
      const acc = await ethWaller.request({ method: "eth_accounts" });
      handleCustomerAcc(acc[0]);
    }
  };

  const handleCustomerAcc = (account) => {
    if (account) {
      console.log("User account connected: ", account);
      setCustomerAcc(account);
    } else {
      console.log("No account found");
    }
  };

  const connectCustomerAcc = async () => {
    if (!ethWaller) {
      alert("Meta Mask wallet is required ");
      return;
    }

    const acc = await ethWaller.request({
      method: "eth_requestAccounts",
    });
    handleCustomerAcc(acc[0]);
    getFinanceManagemntCont();
  };

  const getFinanceManagemntCont = () => {
    const wallet_provider = new Web3Provider(ethWaller);
    const signer = wallet_provider.getSigner();
    const financeMangement = new ethers.Contract(
      contractAddress,
      financeManagementABI,
      signer
    );
    setFinanceManagementContract(financeMangement);
  };

  const getAccFund = async () => {
    if (financeManagementContract) {
      try {
        const funds = await financeManagementContract.getAccFund();
        setAccountFunds(funds.toBigInt());
      } catch (error) {
        console.error("Error fetching account funds:", error.message);
      }
    }
  };

  const addFunds = async () => {
    if (financeManagementContract) {
      let tx = await financeManagementContract.addBalance(1);
      await tx.wait();
      getAccFund();
      showAlert("Funds added successfully! Added 10 ETH.");
    }
  };

  const withdrawFunds = async () => {
    if (financeManagementContract) {
      let tx = await financeManagementContract.withdraw(10); // Withdraw 10 ETH
      await tx.wait();
      getAccFund();
      showAlert("Funds withdrawn successfully! Withdrawn 10 ETH.");
    }
  };

  const showAlert = (message) => {
    alert(message);
  };

  const handleSecurityCodeInputChange = (e) => {
    setSecurityPinInp(e.target.value);
  };
  const handleChangeCode = (e) => {
    setConfirmPin(e.target.value);
  };

  const handlenewSecurityPinInpChange = (e) => {
    setNewSecurityPinInp(e.target.value);
  };

  const validateSecurityCode = () => {
    return securityPinInp === confirmPin;
  };

  const changeSecurityCode = async () => {
    if (validateSecurityCode()) {
      await financeManagementContract?.changePassKey(newSecurityPinInp);
      showAlert("Security code changed successfully!");
      setSecurityPinInp("");
      setNewSecurityPinInp("");
    } else {
      showAlert("Security codes do not match. Security code change failed.");
    }
  };

  const initUser = () => {
    if (!ethWaller) {
      return (
        <p>Please install MetaMask to use this Wealth Management system.</p>
      );
    }

    if (!customerAcc) {
      return (
        <button className="button" onClick={connectCustomerAcc}>
          Connect MetaMask Wallet
        </button>
      );
    }

    if (accFunds === undefined) {
      getAccFund();
    }

    return (
      <div>
        <div>
          <p>Customer Account is : {customerAcc}</p>
          <p>Available Funds: {accFunds} ETH</p>
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter Security Code"
              onChange={handleSecurityCodeInputChange}
            />
            <button className="button" onClick={addFunds}>
              Add Funds (10 ETH)
            </button>
            <button className="button" onClick={withdrawFunds}>
              Withdraw Funds (10 ETH)
            </button>
          </div>

          <style jsx>{`
            .input-container {
              width: 28em;
              display: flex;
              flex-direction: column;
              gap: 0.5em;
            }

            .button {
              padding: 12px;
              background-color: #9b59b6;
              color: #fff;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              transition: background-color 0.35s ease;
            }

            .button:hover {
              background-color: #2980b9;
            }

            input {
              width: 100%;
              padding: 8px;
              margin-top: 5px;
              font-size: 14px;
              border: 1px solid #bdc3c7;
              border-radius: 5px;
            }

            .input-container {
              width: 30em;
              display: flex;
              flex-direction: column;
              gap: 1em;
            }

            .button {
              padding: 12px;
              background-color: #9b59b6;
              color: #fff;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              transition: background-color 0.3s ease;
            }

            .button:hover {
              background-color: #8e44ad;
            }

            input {
              width: 100%;
              padding: 10px;
              margin-top: 8px;
              font-size: 16px;
              border: 2px solid #3498db;
              border-radius: 6px;
            }

            h2 {
              color: #34495e;
              margin-bottom: 12px;
            }

            p {
              margin: 0;
              margin-bottom: 6px;
              font-size: 1.5rem;
            }
          `}</style>
        </div>
        <div>{securityCodeSection()}</div>
      </div>
    );
  };

  const securityCodeSection = () => {
    return (
      <div>
        <h2>Change Security Code</h2>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter Security Pin"
            onChange={handleChangeCode}
          />
          <input
            type="text"
            placeholder="Enter New Security Pin"
            value={newSecurityPinInp}
            onChange={handlenewSecurityPinInpChange}
          />
          <button className="button" onClick={changeSecurityCode}>
            Change Security Code
          </button>
        </div>
        <style jsx>{`
          .input-container {
            width: 30em;
            display: flex;
            flex-direction: column;
            gap: 1em;
          }

          .button {
            padding: 12px;
            background-color: #9b59b6;
            color: #fff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .button:hover {
            background-color: #8e44ad;
          }

          input {
            width: 100%;
            padding: 10px;
            margin-top: 8px;
            font-size: 16px;
            border: 2px solid #3498db;
            border-radius: 6px;
          }

          h2 {
            color: #34495e;
            margin-bottom: 12px;
          }

          p {
            margin: 0;
            margin-bottom: 6px;
          }
        `}</style>
      </div>
    );
  };

  useEffect(() => {
    getEthWallet();
  }, []);

  return (
    <main className="container">
      <div className="content">{initUser()}</div>
      <style jsx>{`
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #ecf0f1;
          font-family: "Segoe UI", sans-serif;
          width: 100%;
          height: 100vh;
          margin: 0;
          padding: 0;
        }

        .button {
          padding: 12px;
          background-color: #9b59b6;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .button:hover {
          background-color: #8e44ad;
        }

        .content {
          display: flex;
          flex-direction: column;
          gap: 3em;
          padding: 3em;
          border-radius: 11px;
          background-color: #ecf0f1;
          width: 100%;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .input-container {
          width: 30em;
          display: flex;
          flex-direction: column;
          gap: 1em;
        }

        input {
          width: 100%;
          padding: 10px;
          margin-top: 8px;
          font-size: 16px;
          border: 2px solid #3498db; /* Blue */
          border-radius: 6px;
        }

        p {
          margin: 0;
          margin-bottom: 6px;
          font-size: 1.2rem;
          font-weight: 700;
          color: #333; /* Dark Gray */
        }

        h2 {
          margin-bottom: 12px;
          color: #34495e; /* Dark Blue Gray */
        }
      `}</style>
    </main>
  );
}
