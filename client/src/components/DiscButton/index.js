import React from 'react'
import { Button } from 'react-bootstrap'
import style from './index.module.css'

export default function DiscButton({user, balance, disc}) {
  return (
    <>
      <div className={style.walletCard}>
        <h4> {'Connect your MetaMask'} </h4>
        <div className='accountDisplay'>
          <h3>Address: {user}</h3>
        </div>
        <div className='balanceDisplay'>
          <h3>Balance: {balance}</h3>
        </div>
        <Button onClick={disc} variant='light'>
          Disconnect
        </Button>
        </div>
      </>
      )
}

