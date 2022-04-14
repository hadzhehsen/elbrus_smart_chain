import { useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
// import { useRouter } from 'next/router'
import Web3Modal from 'web3modal';
import { useNavigate } from 'react-router-dom';
import { marketplaceAddress } from '../../config';
// import NFTMarketplace from '../../artifacts/contracts/NFTMarket.sol/NFTMarketplace.json'
import NFTMarketplace from '../../NFTMarketplace.json';
import { Button, Card, Form, Image } from 'react-bootstrap';
import styles from './CreateNftPage.module.css';
import Loader2 from '../Loader2';
import './Styles.css';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

export default function CreateNFT() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: '',
    name: '',
    description: '',
  });
  const [loader, setLoader] = useState('');

  const navigate = useNavigate();
  // const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }
  async function uploadToIPFS() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url;
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function listNFTForSale() {
    setLoader(true);
    const url = await uploadToIPFS();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    const price = ethers.utils.parseUnits(formInput.price, 'ether');
    // console.log(price)
    let contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer,
    );
    console.log(contract);
    let listingPrice = await contract.getListingPrice();
    console.log(listingPrice);
    listingPrice = listingPrice.toString();
    let transaction = await contract.createToken(url, price, {
      value: listingPrice,
    });
    await transaction.wait();
    navigate('/homeNFT');
    setLoader('');
  }

  return (
    <Form
      className='container col-md-5 '
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <Form.Group>
        <Form.Control
          placeholder='Asset Name'
          className='my-1'
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          as='textarea'
          placeholder='Asset Description'
          className='my-1'
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          placeholder='Asset Price in Eth'
          className='my-1'
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          type='file'
          name='Asset'
          className='my-1'
          onChange={onChange}
        />
      </Form.Group>
      <Form.Group className='mx-auto'>
        {fileUrl && (
          <Image
            className='rounded'
            width={300}
            height={300}
            src={fileUrl}
            alt={'kartinka'}
          />
        )}
      </Form.Group>
      <button onClick={listNFTForSale} className='mx-auto my-1 kek'>
        Create NFT
      </button>
      {loader !== '' ? <Loader2 /> : ''}
    </Form>
  );
}
