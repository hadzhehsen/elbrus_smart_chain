import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import './Styles.css';
import { marketplaceAddress } from '../../config';

import NFTMarketplace from '../../NFTMarketplace.json';
import { Card } from 'react-bootstrap';

export default function DashBoardPage() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer,
    );
    const data = await contract.fetchItemsListed();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
        };
        return item;
      }),
    );

    setNfts(items);
    setLoadingState('loaded');
  }
  if (loadingState === 'loaded' && !nfts.length)
    return <h1 className='py-10 px-20 text-3xl'>No NFTs listed</h1>;
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
        {nfts.map((nft, i) => (
          <Card
            key={i}
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
            <Card.Img
              src={nft.image}
              className=''
              variant='top'
              style={{ width: 275, height: 275 }}
              alt='kartinka'
            />
            {/* <div className=''> */}
            <p className=''>New price - {nft.price} Eth</p>
            {/* </div> */}
          </Card>
        ))}
      </div>
    </div>
  );
}
