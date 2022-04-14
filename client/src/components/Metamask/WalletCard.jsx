// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import style from './index.module.css';
import MetamaskModal from '../MetamaskModal';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import ConnectButton from '../ConnectButton';
import DiscButton from '../DiscButton';
import { useDispatch, useSelector } from 'react-redux';
import { addUsers } from '../../redux/actions/user.action';
import { asyncDelUser } from '../../redux/thunk/delUser.thunk';

const WalletCard = () => {
  const user = useSelector((store) => store.users);
  console.log('USEEEEEEERS', user);
  axios.defaults.withCredentials = false;
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');
  const [user1, setUser1] = useState(null);
  const [balance, setBalance] = useState(null);
  const dispatch = useDispatch();

  // if (window.onbeforeunload) {
  //   dispatch(asyncDelUser(user[user.length - 1]))
  //   setUser1(null);
  //   setBalance(null);
  //   setUserBalance(null);
  //   localStorage.removeItem('wallet');
  //   localStorage.removeItem('balance');
  // }

  useEffect(() => {
    setUser1(localStorage.getItem('wallet'));
    setBalance(localStorage.getItem('balance'));
  }, [userBalance, defaultAccount]);

  const disconnect = async () => {
    dispatch(asyncDelUser(user[user.length - 1]));
    setUser1(null);
    setBalance(null);
    setUserBalance(null);
    localStorage.removeItem('wallet');
    localStorage.removeItem('balance');
  };

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log('MetaMask Here!');
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText('Wallet Connected');
          getAccountBalance(result[0]);
          console.log(result);
          setUser1(result[0]);
          localStorage.setItem('wallet', result[0]);
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

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
    console.log(newAccount.toString());
    localStorage.setItem('wallet', newAccount.toString());
    localStorage.setItem('balance', getAccountBalance(newAccount.toString()));
    // window.location.reload();
  };

  const getAccountBalance = (account) => {
    window.ethereum
      .request({ method: 'eth_getBalance', params: [account, 'latest'] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
        localStorage.setItem('balance', ethers.utils.formatEther(balance));
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
      <div>
        {!user1 ? (
          <ConnectButton connect={connectWalletHandler} user={user1} />
        ) : (
          <DiscButton user={user1} balance={balance} disc={disconnect} />
        )}
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
