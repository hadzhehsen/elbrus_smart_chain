import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
// import { useRouter } from 'next/router'
import { useNavigate } from 'react-router-dom';
import { marketplaceAddress } from '../../config';
import NFTMarketplace from '../../NFTMarketplace.json';
import { Button, Card } from 'react-bootstrap';
import './Styles.css';

export default function MyNftPage() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const navigate = useNavigate();
  // const router = useRouter()
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

    const marketplaceContract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer,
    );
    const data = await marketplaceContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          tokenURI,
        };
        return item;
      }),
    );
    setNfts(items);
    setLoadingState('loaded');
  }
  function listNFT(nft) {
    console.log('nft:', nft);
    navigate(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  }
  if (loadingState === 'loaded' && !nfts.length)
    return <h1 className='py-10 px-20 text-3xl'>No NFTs owned</h1>;
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
            className='box'
            key={i}
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
            // style={{
            //   opacity: 0.9,
            //   // width: 675,
            //   color: 'white',
            //   gap: 20,
            //   flexDirection: 'row',
            //   backgroundColor: 'rgba(255, 255, 255, 0.01)', //145,46,84
            //   backdropFilter: 'blur(1px)',
            //   alignItems: 'center',
            //   justifyContent: 'center',
            // }}
          >
            <Card.Img
              src={nft.image}
              variant='top'
              alt='kartinka'
              style={{ width: 275, height: 275 }}
            />
            {/* <Card.Body className=''> */}
            <p className=''>Last price - {nft.price} Eth</p>
            <button
              className='kek'
              // variant='light'
              onClick={() => listNFT(nft)}
            >
              Put on sell
            </button>
            {/* </Card.Body> */}
          </Card>
        ))}
      </div>
    </div>
    // </div>
  );
}
