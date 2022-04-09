import { Route, Routes } from "react-router-dom";
import Faces from "./components/Faces";
import Home from "./components/Home";
import Images from "./components/Images";
import Navbar from "./components/Navbar";
import WalletCard from "./components/Metamask/WalletCard";
import WalletCardEthers from "./components/Metamask/WalletCardEthers";
import CreateNFT from "./components/NFT/CreateNftPage";
import HomePage from "./components/NFT/HomePage"
import MyNftPage from "./components/NFT/MyNftPage";
import DashBoardPage from "./components/NFT/DashBoardPage";
import HeaderPage from "./components/NFT/UI/header/HeaderPage";
import ResellNFT from "./components/NFT/ResselNftPage";

function App() {
  return (
    <>
    {/*<Navbar/>*/}
    {/*  <HeaderPage/>*/}
    <Routes>
      <Route path="/" element={<HeaderPage/>}/>
      <Route path="/create-nft" element={<CreateNFT/>}/>
      <Route path="/my-nfts" element={<MyNftPage/>}/>
      <Route path="/dashboard" element={<DashBoardPage/>}/>
      {/*<Route path="/resell-nft" element={<ResellNFT/>}/>*/}

      {/*<Route path="/images" element={<Images/>}/>*/}
      {/*<Route path="/faces" element={<Faces/>}/>*/}
      {/*<Route path="/main" element={<Home/>}/>*/}
    </Routes>
      {/*<WalletCard/>*/}
      {/*<WalletCardEthers/>*/}
    </>
  );
};

export default App;
