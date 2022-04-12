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
import { flexbox } from '@mui/system';

export default function HomePage() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider();
    // 'https://polygon-mumbai.infura.io/v3/338748305bac46e7bc0437a0a790e08b',
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

        console.log(tokenUri);
        const meta = await axios(tokenUri);

        // const meta = await fetch(tokenUri, { method: 'GET', mode: 'no-cors', credentials: 'include' });
        // const meta = await fetch('http://localhost:3001/tokenUri', {
        //   method: 'GET',
        //   headers: { 'Content-Type': 'application/JSON' },
        //   mode: 'no-cors',
        //   body: JSON.stringify(tokenUri),
        // }).then((info) => console.log(info));
        // const response = await
        // console.log(meta);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        // console.log(meta);
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
  // console.log(nfts);

  // console.log(loadingState);
  if (loadingState === 'loaded' && !nfts.length)
    return <h1 className='px-20 py-10 text-3xl'>No items in marketplace</h1>;
  return (
    <>
      <Carousel
        interval={10000000}
        style={
          {
            // width: 1000,
            // height: 300,
          }
        }
      >
        {nfts.map((nft) => (
          <Carousel.Item key={nft.tokenId}>
            <div className='' style={{ padding: 75 }}>
              <Card
                className='px-5'
                key={nft.tokenId}
                style={{
                  opacity: 0.9,
                  // width: 675,
                  color: 'white',
                  gap: 20,
                  flexDirection: 'row',
                  backgroundColor: 'rgba(255, 255, 255, 0.01)', //145,46,84
                  backdropFilter: 'blur(1px)',
                }}
              >
                <div className='px-5' style={{ maxWidth: 400, maxHeight: 400 }}>
                  <Card.Img
                    // className='w-100'
                    src={nft.image}
                    style={{
                      maxWidth: 250,
                      minWidth: 250,
                      maxHeight: 250,
                      minHeight: 250,
                    }}
                    variant='top'
                    alt={`imageNumber${nft.tokenId}`}
                  />
                </div>
                <div className=''>
                  <Card.Title>Title {nft.name}</Card.Title>
                  <Card.Text style={{}}>
                    Description {nft.description}
                  </Card.Text>
                  <Card.Text style={{}}>Price {nft.price} MATIC</Card.Text>
                  <Card.Text style={{}}>Owner: {nft.owner}</Card.Text>
                  <Card.Text style={{}}>Who selling: {nft.seller}</Card.Text>
                  <Button
                    variant='light'
                    style={{ borderColor: 'black' }}
                    onClick={() => buyNft(nft)}
                  >
                    Buy
                  </Button>
                </div>
              </Card>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </>

    // karusel +- rabotaet
    // <div style={{ display: 'flex', justifyContent: 'center' }}>
    //   <Carousel
    //     style={
    //       {
    //         // alignItems: 'center',
    //       }
    //     }
    //   >
    //     {nfts.map((el) => (
    //       <Carousel.Item style={{}}>
    //         <img
    //           className='d-block'
    //           alt='kek'
    //           src={el.image}
    //           style={{ width: 400, height: 400 }}
    //         />
    //         <Carousel.Caption>
    //           <h5 style={{ color: 'blue' }}>{el.name}</h5>
    //         </Carousel.Caption>
    //       </Carousel.Item>
    //     ))}
    //   </Carousel>
    // </div>
  );
}
