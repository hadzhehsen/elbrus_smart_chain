// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import style from './index.module.css';
import MetamaskModal from '../MetamaskModal';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addUsers } from '../../redux/actions/user.action';

const WalletCard = () => {
  const user = useSelector((store) => store.users);
  axios.defaults.withCredentials = false;
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');
  const dispatch = useDispatch();

  // useEffect(() => {
  //   axios('http://localhost:3001/isauth').then(
  //     (data) => dispatch(addUsers(data.data)),
  //     // console.log(data.data[0], '8=====================D'),
  //   );
  // }, [user]);

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log('MetaMask Here!');
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText('Wallet Connected');
          getAccountBalance(result[0]);
          // console.log(result);
          axios
            .post(
              'http://localhost:3001/wallet',
              { result: result[0] },
              {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            )
            .then((data) => dispatch(addUsers(data.data)));
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      setDefaultAccount(null);
      console.log('Need to install MetaMask');
      setErrorMessage('Please install MetaMask browser extension to interact');
    }
  };
  // console.log('-------------', user);
  // async function disconnect

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
    <>
      <div className={style.walletCard}>
        <h4> {'Connect your MetaMask'} </h4>
        <div className='accountDisplay'>
          <h3>Address: {defaultAccount}</h3>
        </div>
        <div className='balanceDisplay'>
          <h3>Balance: {userBalance}</h3>
        </div>
        <Button onClick={connectWalletHandler} variant='light'>
          {user ? 'Logout' : 'Login'}
        </Button>
        {errorMessage && (
          <MetamaskModal
            setError={setErrorMessage}
            error={errorMessage}
            status={true}
          />
        )}
      </div>
    </>
  );
};

export default WalletCard;
