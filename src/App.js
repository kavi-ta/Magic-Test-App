import logo from "./logo.svg";
// import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { Magic } from "magic-sdk";
import Web3 from "web3";
import mintContractABI from "./contract/mint.json";

const getContract = (web3) => {
  const contract = new web3.eth.Contract(
    mintContractABI,
    // APOTHEM
    "0x9E068b57C6EFDd9424d50bE3b23d3995c5C870db"
    // STABILITY
    // "0x9E068b57C6EFDd9424d50bE3b23d3995c5C870db"
    // MAINNET
    // "0x9E068b57C6EFDd9424d50bE3b23d3995c5C870db"
    // STABILITY TESTNET
    // "0x9E068b57C6EFDd9424d50bE3b23d3995c5C870db"
  );
  return contract;
};

const initializeMagicSDK = () => {
  const magic = new Magic(process.env.REACT_APP_MAGIC_API, {
    network: {
      // apothem
      rpcUrl: "https://erpc.apothem.network/",
      chainId: 51,

      // stability
      // rpcUrl: `https://gtn.stabilityprotocol.com/zgt/${process.env.REACT_APP_STABLITY_RPC_KEY}`,
      // chainId: 101010,

      // MAINNET
      // rpcUrl: "https://erpc.xinfin.network/",
      // chainId: 50,

      // stability testnet
      // rpcUrl: "https://free.testnet.stabilityprotocol.com/",
      // chainId: 20180427,
    },
  });
  return magic;
};

const getWeb3 = (magic) => {
  const web3 = new Web3(magic.rpcProvider);
  return web3;
};

function App() {
  // states
  const [email, setEmail] = useState("");
  const [magic, setMagic] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const magic_ = initializeMagicSDK();
    setMagic(magic_);
  }, []);

  useEffect(() => {
    if (magic) {
      const web3_ = getWeb3(magic);
      setWeb3(web3_);
      const contract_ = getContract(web3_);
      setContract(contract_);
    }
  }, [magic]);

  const handleConnectToMagic = () => {
    login(email, true);
  };

  const handleMint = async () => {
    const gasPrice = await web3.eth.getGasPrice();
    const res = await contract.methods.mint(account, 10).send({
      from: account,
      gas: 1000000,
      gasPrice: gasPrice,
    });
    console.log("RESPONSE:", res.transactionHash);
  };
  const login = async (emailAddress, showUI) => {
    try {
      const did = await magic.auth.loginWithEmailOTP({
        email: emailAddress,
        showUI: showUI,
      });
      const userInfo = await magic.user.getInfo();
      console.log(userInfo);
      setAccount(userInfo?.publicAddress);
      // Handle user information as needed
    } catch {
      // Handle errors if required!
    }
  };

  return (
    <div
      className="App"
      style={{
        borderRadius: "50%",
      }}
    >
      <form
        className="bg-current w-40"
        style={{
          width: "40%",
          borderRadius: "0.3rem",
          margin: "10% auto",
          padding: "4rem",
          backgroundColor: "#4d4b5b",
        }}
      >
        <h2 className="text-white mb-4 py-4">Magic Link Test App</h2>
        <div className="mb-3">
          <input
            className="form-control"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            placeholder="Enter email"
          />
        </div>

        <button
          type="button"
          className="btn btn-light-outline text-white border-white"
          onClick={account ? handleMint() : handleConnectToMagic()}
        >
          {account ? "Mint Tokens" : "Connect To Magic"}
        </button>
      </form>
    </div>
  );
}

export default App;
