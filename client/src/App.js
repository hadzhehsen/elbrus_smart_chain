import Faces from './components/Faces';
import Home from './components/Home';
import Images from './components/Images';
import Navbar from './components/Navbar';
import { Route, Routes } from "react-router-dom";
import CustomizedSwitches from "./components/Switch/switch";
import Connect from "./components/Connect";
import CreateNFT from "./components/NFT/CreateNftPage";
import HomePage from "./components/NFT/HomePage"
import MyNftPage from "./components/NFT/MyNftPage";
import DashBoardPage from "./components/NFT/DashBoardPage";
import HeaderPage from "./components/NFT/UI/header/HeaderPage";
import ResellNFT from "./components/NFT/ResselNftPage";


function App() {



  return (
    <>

    <CustomizedSwitches />
    <Navbar/>

    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/images" element={<Images/>}/>
      <Route path="/faces" element={<Faces/>}/>
      <Route path="/main" element={<Connect/>}/>
      <Route path="/header" element={<HeaderPage/>}/>
      <Route path="/create-nft" element={<CreateNFT/>}/>
      <Route path="/my-nfts" element={<MyNftPage/>}/>
      <Route path="/dashboard" element={<DashBoardPage/>}/>
      {/*<Route path="/resell-nft" element={<ResellNFT/>}/>*/}
    </Routes>
    </>
  );
};

export default App;
