import Faces from './components/Faces';
import Home from './components/Home';
import Images from './components/Images';
import { Route, Routes } from 'react-router-dom';
import Preloader2 from './components/Preloader2';
import Connect from './components/Connect';
import CreateNFT from './components/NFT/CreateNftPage';
import HomePage from './components/NFT/HomePage';
import MyNftPage from './components/NFT/MyNftPage';
import DashBoardPage from './components/NFT/DashBoardPage';
import HeaderPage from './components/NFT/UI/header/HeaderPage';
import ResellNFT from './components/NFT/ResselNftPage';
import './App.css';
import Particle from './components/Particles';
import Navbar from './components/Navbar/';
import { StyledEngineProvider } from '@mui/material';

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <div className='App'>
        <Particle />
        <Preloader2 />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/generate' element={<Images />} />
          {/* <Route path='/faces' element={<Faces />} /> */}
          <Route path='/connect' element={<Connect />} />
          <Route path='/explore' element={<HomePage />} />
          <Route path='/upload' element={<CreateNFT />} />
          <Route path='/my-nfts' element={<MyNftPage />} />
          <Route path='/listed-nfts' element={<DashBoardPage />} />
          <Route path='/resell-nft' element={<ResellNFT />} />
        </Routes>
      </div>
    </StyledEngineProvider>
  );
}

export default App;
