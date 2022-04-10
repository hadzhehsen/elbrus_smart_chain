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

export default function Preloader2 () {

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(undefined)
  const [completed, setCompleted] = useState(undefined)


  useEffect(()=> {
    setTimeout(() => {
      fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then((response) => response.json())
      .then((json) => {
        setData(json)
        setLoading(true)
        setCompleted(true)
      });
    }, 3000);
  }, [])

  return (
    <>
    <Particle/>
    {!completed ? (<Lottie options={defaultOptions}
              
              height={400}
              width={400}/>)
              
    :
    (<Navbar/>
    )}
    </>
  )
}
