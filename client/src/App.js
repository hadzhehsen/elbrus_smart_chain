import { Route, Routes } from "react-router-dom";
import Faces from "./components/Faces";
import Images from "./components/Images";
import Connect from "./components/Connect";
import Home from "./components/Home";
import Preloader2 from "./components/Preloader2";
// import Preloader from "./components/Preloader";


function App() {


  return (
    <>
    <Preloader2 />
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/images" element={<Images/>}/>
      <Route path="/faces" element={<Faces/>}/>
      <Route path="/main" element={<Connect/>}/>
    </Routes>
    </>
  );
}

export default App;
