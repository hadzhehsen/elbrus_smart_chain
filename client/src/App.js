import { Route, Routes } from "react-router-dom";
import Faces from "./components/Faces";
import Images from "./components/Images";
import WalletCard from "./components/Metamask/WalletCard";
import WalletCardEthers from "./components/Metamask/WalletCardEthers";
import Navbar from "./components/Navbar";
import CustomizedSwitches from "./components/Switch/switch";
import Connect from "./components/Connect";
import Home from "./components/Home";





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
    </Routes>
    
    
    </>
  );
};

export default App;
