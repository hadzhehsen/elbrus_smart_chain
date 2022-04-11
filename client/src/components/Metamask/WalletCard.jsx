// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import style from './index.module.css';
import MetamaskModal from '../MetamaskModal';
import axios from 'axios';
import { Button } from 'react-bootstrap';

const WalletCard = () => {
  axios.defaults.withCredentials = true;
  console.log(axios.defaults, 'axiooosssss');
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');

  useEffect(() => {
    axios('http://localhost:3002/isauth').then((data) =>
      console.log(data.data),
    );
  }, []);

  // console.log('---pre---------', window.ethereum);

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
          console.log(result);
          axios.post(
            'http://localhost:3002/wallet',
            { result: result[0] },
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log('Need to install MetaMask');
      setErrorMessage('Please install MetaMask browser extension to interact');
    }
  };

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

  // listen for account changes
  window.ethereum?.on('accountsChanged', accountChangedHandler);

  window.ethereum?.on('chainChanged', chainChangedHandler);

  return (
    <div className={style.walletCard}>
      <h4> {'Connect your MetaMask'} </h4>
      <div className='accountDisplay'>
        <h3>Address: {defaultAccount}</h3>
      </div>
      <div className='balanceDisplay'>
        <h3>Balance: {userBalance}</h3>
      </div>
      <Button onClick={connectWalletHandler} variant='light'>
        {window.ethereum?._events.connect === true ? 'Connect' : 'Disconnect'}
      </Button>
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
