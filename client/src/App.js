import Faces from './components/Faces';
import Home from './components/Home';
import Images from './components/Images';
import { Route, Routes } from "react-router-dom";
import Preloader2 from "./components/Preloader2";
import Connect from "./components/Connect";
import CreateNFT from "./components/NFT/CreateNftPage";
import HomePage from "./components/NFT/HomePage"
import MyNftPage from "./components/NFT/MyNftPage";
import DashBoardPage from "./components/NFT/DashBoardPage";
import HeaderPage from "./components/NFT/UI/header/HeaderPage";
import ResellNFT from "./components/NFT/ResselNftPage";
import './App.css'
import Particle from './components/Particles';


function App() {



  return (
    <>
      <div className='App'>
        <Particle />
        <Preloader2 />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/images" element={<Images />} />
          <Route path="/faces" element={<Faces />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/homeNFT" element={<HomePage />} />
          <Route path="/create-nft" element={<CreateNFT />} />
          <Route path="/my-nfts" element={<MyNftPage />} />
          <Route path="/dashboard" element={<DashBoardPage />} />
          <Route path="/resell-nft" element={<ResellNFT />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
