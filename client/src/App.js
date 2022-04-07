import { Route, Routes } from "react-router-dom";
import Faces from "./components/Faces";
import Home from "./components/Home";
import Images from "./components/Images";
import WalletCard from "./components/Metamask/WalletCard";
import WalletCardEthers from "./components/Metamask/WalletCardEthers";
import Navbar from "./components/Navbar";





function App() {


  return (
    <>
    
    <Navbar/>
    <Routes>
      <Route path="/images" element={<Images/>}/>
      <Route path="/faces" element={<Faces/>}/>
      <Route path="/main" element={<Home/>}/>
    </Routes>
    <WalletCard/>
    <WalletCardEthers/>
    </>
  );
};

export default App;
