<<<<<<< HEAD
import { Route, Routes } from 'react-router-dom';
import Faces from './components/Faces';
import Home from './components/Home';
import Images from './components/Images';
import Navbar from './components/Navbar';
=======
import { Route, Routes } from "react-router-dom";
import Faces from "./components/Faces";
import Images from "./components/Images";
import WalletCard from "./components/Metamask/WalletCard";
import WalletCardEthers from "./components/Metamask/WalletCardEthers";
import Navbar from "./components/Navbar";
import CustomizedSwitches from "./components/Switch/switch";
import Connect from "./components/Connect";
import Home from "./components/Home";

>>>>>>> origin/testBranch

function App() {


  return (
    <>
<<<<<<< HEAD
      <Navbar />
      <Routes>
        <Route path='/images' element={<Images />} />
        <Route path='/faces' element={<Faces />} />
        <Route path='/main' element={<Home />} />
      </Routes>
=======
    <CustomizedSwitches />
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/images" element={<Images/>}/>
      <Route path="/faces" element={<Faces/>}/>
      <Route path="/main" element={<Connect/>}/>
    </Routes>
>>>>>>> origin/testBranch
    </>
  );
}

export default App;
