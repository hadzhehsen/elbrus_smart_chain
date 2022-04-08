import { Route, Routes } from 'react-router-dom';
import Faces from './components/Faces';
import Home from './components/Home';
import Images from './components/Images';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/images' element={<Images />} />
        <Route path='/faces' element={<Faces />} />
        <Route path='/main' element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
