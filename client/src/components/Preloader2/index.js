import { useEffect, useMemo, useState } from "react";
import Lottie from 'react-lottie';
import Navbar from "../Navbar";
import Particle from "../Particles";
import * as location from './102030-earth-love-earth-day.json';

const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData: location.default,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

export default function Preloader2() {
  const [loader, setLoader] = useState(localStorage.getItem('newStorage'))


  console.log(loader)
  useEffect(() => {
    if (!loader)
      setTimeout(() => {
        localStorage.setItem('newStorage', 'true');
        setLoader(localStorage.getItem('newStorage'))

      }, 3000);
  }, [])

  return (
    <>
      {!loader ? (<Lottie options={defaultOptions}
        height={400}
        width={400} />)
        :
        (<Navbar />
        )
      }
    </>
  )
}
