import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, {useEffect, useState} from "react";

// Constants
const TWITTER_HANDLE = 'yoyothesheep';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
//const OPENSEA_LINK = '';
//const TOTAL_MINT_COUNT = 50;

const App = () => {

  // store user's wallet here
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    // Setup Methods: check wallet state, connect & save wallet info if needed

    // Check access to Eth environment info
    const { ethereum } = window;

    if (!ethereum) { console.log("Please install an Ethereum wallet before proceeding!")} 
    else { console.log("Proceeding with this ethereum info:", ethereum)}

    // Check authorization to user wallet
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    // If multiple accounts authorized, use first one
    // TODO - why do we need this whole section here? Can clean up.
    if (accounts.length !== 0) {
      const thisAccount = accounts[0];
      setCurrentAccount(thisAccount);
    }
    else {
      console.log("TODO: no authorized accounts. Need to authorize");
    }
  };

  // Connect wallet 
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) { 
        alert("Install an Ethereum wallet plz");
        return;
      } 
      
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      // If multiple accounts authorized, use first one
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  };

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  // Run these methods on pageload
  useEffect(() => { checkIfWalletIsConnected(); }, []  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Roll the dice and get a Word Salad NFT</p>
          <p className="sub-text">
            Come oooooon, discover your handle today.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={null} className="cta-button connect-wallet-button">
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
