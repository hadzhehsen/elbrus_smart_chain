import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
// import { useRouter } from 'next/router'
import axios from 'axios';
import Web3Modal from 'web3modal';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import './Styles.css';
import { marketplaceAddress } from '../../config';

import NFTMarketplace from '../../NFTMarketplace.json';
import { Card, Form } from 'react-bootstrap';

export default function ResellNFT() {
  const [formInput, updateFormInput] = useState({ price: '', image: '' });
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const tokenURI = searchParams.get('tokenURI');

  const { image, price } = formInput;

  useEffect(() => {
    fetchNFT();
  }, [id]);

  async function fetchNFT() {
    if (!tokenURI) return;
    const meta = await axios.get(tokenURI);
    updateFormInput((state) => ({ ...state, image: meta.data.image }));
  }

  async function listNFTForSale() {
    if (!price) return;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const priceFormatted = ethers.utils.parseUnits(formInput.price, 'ether');
    let contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer,
    );
    let listingPrice = await contract.getListingPrice();

    listingPrice = listingPrice.toString();
    let transaction = await contract.resellToken(id, priceFormatted, {
      value: listingPrice,
    });
    await transaction.wait();

    navigate('/homeNFT');
  }

  return (
    <div
      className='container'
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto',
      }}
    >
      <div
        className=''
        style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}
      >
        <Card
          className='box'
          style={{
            width: 300,
            height: 400,
            padding: 8,
            margin: 10,
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.01)',
            backdropFilter: 'blur(5px)',
            borderColor: 'white',
            alignItems: 'center',
            border: 'transparent',
          }}
        >
          {image && <img className='' width='250' src={image} alt='kartinka' />}
          <Card.Body
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <Form.Control
              placeholder='Asset Price in Eth'
              className=''
              onChange={(e) =>
                updateFormInput({ ...formInput, price: e.target.value })
              }
            />
            <button onClick={listNFTForSale} className='kek'>
              List NFT
            </button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
