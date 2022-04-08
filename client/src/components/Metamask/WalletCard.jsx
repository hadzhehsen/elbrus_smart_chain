// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './index.module.css';
import MetamaskModal from '../MetamaskModal';

const WalletCard = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');

  // useEffect(() => {
  //   if (window.ethereum._events.connect === false) {
  //     setConnButtonText('Connect Wallet');
  //   }
  // }, []);

  console.log('---pre---------', window.ethereum);

  const connectWalletHandler = () => {
    // console.log(window.ethereum);
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log('MetaMask Here!');

      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText('Wallet Connected');
          getAccountBalance(result[0]);
          console.log(result[0], '<=================');
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log('Need to install MetaMask');
      setErrorMessage('Please install MetaMask browser extension to interact');
    }
  };

  console.log('---POST AUTH---------', window.ethereum._events.connect);

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
  };

  const getAccountBalance = (account) => {
    window.ethereum
      .request({ method: 'eth_getBalance', params: [account, 'latest'] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };

  // console.log(window);
  // listen for account changes
  window.ethereum?.on('accountsChanged', accountChangedHandler);

  window.ethereum?.on('chainChanged', chainChangedHandler);

  return (
    // console.log(
    //   window.ethereum.isConnected()
    //   // Boolean(window.ethereum._events.connect),
    //   // 'rettuuurn2å∑∑∑∑∑∑´´∑œ∑´œ™™™™™∑´ß',
    // ),
    <div className='walletCard'>
      <h4> {'Connection to MetaMask using window.ethereum methods'} </h4>
      <button onClick={connectWalletHandler}>
        {window.ethereum._events.connect === true
          ? 'proverka ok'
          : 'login pidor'}
        {console.log(Boolean(window.ethereum._events.connect))}
      </button>
      <div className='accountDisplay'>
        <h3>Address: {defaultAccount}</h3>
      </div>
      <div className='balanceDisplay'>
        <h3>Balance: {userBalance}</h3>
      </div>
      {errorMessage && (
        <MetamaskModal
          setError={setErrorMessage}
          error={errorMessage}
          status={true}
        />
      )}
    </div>
  );
};

export default WalletCard;
