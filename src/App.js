import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import GroupNFT from './utils/GroupNFT.json';

// Constants
const TWITTER_HANDLE = 'yoyothesheep';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
// TODO - update when deploy new contract
const CONTRACT_ADDRESS = "0x0C330b5AdC5AE7f77ebc91dd99b7Da75e565e103";

//const OPENSEA_LINK = '';
//const TOTAL_MINT_COUNT = 50;

const App = () => {

  // store user's wallet here
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    // Setup Methods: check wallet state, connect & save wallet info if needed

    // Check access to Eth environment info
    const { ethereum } = window;

    if (!ethereum) { 
      console.log("Please install an Ethereum wallet before proceeding!");
      return;
    } 
    else { 
      console.log("Proceeding with this ethereum info:", ethereum);
    }

    // Check authorization to user wallet
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    // If multiple accounts authorized, use first one
    // TODO - why do we need this whole section here? Can clean up.
    if (accounts.length !== 0) {
      const thisAccount = accounts[0];
      console.log("Found an authorized account:", thisAccount);
      setCurrentAccount(thisAccount);

      // set up listener for contract-emitted events.
      // This is for users who ALREADY have their wallet connected & authorized.
      setupEventListener();
    }
    else {
      console.log("TODO: checkIfWalletIsConnected: no authorized accounts. Need to authorize");
    }
  };

  // Connect wallet 
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) { 
        alert("connectWallet: Install an Ethereum wallet plz");
        return;
      } 
      
      // will cause MetaMask popup
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      // If multiple accounts authorized, use first one
      setCurrentAccount(accounts[0]);
      console.log("connectWallet: /n connected");

      // set up listener for contract-emitted events.
      // This is for users who ALREADY have their wallet connected & authorized.
      setupEventListener();

    } catch (error) {
      console.log("connectWallet: /n", error);
    }
  };

  // Set up listener
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      // Same as below
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, GroupNFT.abi, signer);

        // Listener setup
        connectedContract.on("NewGroupNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
          // https://rinkeby.rarible.com/token/0x1f1aC06659cB831a7a476F10d5a1Dcbb8a5d86C4:1?tab=details
        });

        console.log("Setup event listener!")
    
      } else {
        console.log("askContractToMint: Ethereum object doesn't exist.");
      }
    } catch (error) {
      console.log("askContractToMint: /n", error);
    }
  };

  // Mint the NFT
  const askContractToMint = async () => {

    console.log("askContractToMint");

    try {
      const { ethereum } = window;

      if (ethereum) {
        // get the Wallet that we'll use to sign the mint transaction
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        // connect to our GroupNFT contract
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, GroupNFT.abi, signer);

        console.log("going to pop open wallet to get approval to pay gas");
        let nftTxn = await connectedContract.makeGroupNFTs();

        console.log("mining.. wait..");
        await nftTxn.wait();

        console.log(`Mined & minted! See transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("askContractToMint: Ethereum object doesn't exist.");
      }
    } catch (error) {
      console.log("askContractToMint: /n", error);
    }
  };

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  // Run these methods on pageload
  useEffect(() => { 
    checkIfWalletIsConnected(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Roll the dice and get a Word Salad NFT</p>
          <br/><br/>
          <p className="sub-text">
            Come oooooon, 👏🙌 do it ✊ do it 🤜👊🤛
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={askContractToMint} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`say 👋 @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
