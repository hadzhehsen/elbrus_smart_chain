import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import { marketplaceAddress } from '../../config';
// import NFTMarketplace from '../../artifacts/contracts/NFTMarket.sol/NFTMarketplace.json'
import NFTMarketplace from '../../NFTMarketplace.json';
import {
  Button,
  Card,
  CardGroup,
  Carousel,
  Col,
  Container,
  Row,
} from 'react-bootstrap';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider(
      'https://polygon-mumbai.infura.io/v3/338748305bac46e7bc0437a0a790e08b',
    );
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      provider,
    );
    const data = await contract.fetchMarketItems();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        // const meta = await fetch(tokenUri, { method: 'GET', mode: 'no-cors' });
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        console.log(meta);
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      }),
    );
    setNfts(items);
    setLoadingState('loaded');
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer,
    );

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  }
  console.log(nfts);

  // console.log(loadingState);
  if (loadingState === 'loaded' && !nfts.length)
    return <h1 className='px-20 py-10 text-3xl'>No items in marketplace</h1>;
  return (
    <>
      <Carousel>
        {nfts.map((nft, i) => (
          <Carousel.Item>
            <Card
              className='m-1 d-block w-100'
              key={i}
              style={{ backgroundColor: '', opacity: 0.8, width: 275 }}
            >
              <Card.Img
                src={nft.image}
                style={{
                  maxWidth: 250,
                  minWidth: 250,
                  maxHeight: 250,
                  minHeight: 250,
                }}
                variant='top'
                alt={`imageNumber${i}`}
              />
              <Card.Body>
                <Card.Title style={{ color: 'black' }}>
                  Title {nft.name}
                </Card.Title>
                <Card.Text style={{ color: 'black' }}>
                  Description {nft.description}
                </Card.Text>
                <Card.Text style={{ color: 'black' }}>
                  Price {nft.price} MATIC
                </Card.Text>
                <Card.Text style={{ color: 'black' }}>
                  Owner: {nft.owner}
                </Card.Text>
                <Card.Text style={{ color: 'black' }}>
                  Who selling: {nft.seller}
                </Card.Text>
                <Button
                  variant='light'
                  style={{ borderColor: 'black' }}
                  onClick={() => buyNft(nft)}
                >
                  Buy
                </Button>
              </Card.Body>
            </Card>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
}
