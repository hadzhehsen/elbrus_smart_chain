import { Link, useNavigate } from 'react-router-dom';
import './Styless.css';
const Footer = () => {
  const navigate = useNavigate();

  const github = () => {
    navigate('https://github.com/hadzhehsen/elbrus_smart_chain');
  };

  return (
    <div className='container d-flex flex-column myWrapper pt-5'>
      <footer className='myFooter d-flex flex-wrap justify-content-between align-items-center py-4 my-5 mt-auto sticky-bottom'>
        <p className='col-md-4 mb-0 '>&copy; 2022 bifröst, inc</p>
        <ul className='nav col-md-4 justify-content-end'>
          <li className='nav-item'>
            <a
              href='https://t.me/bifrost_smart_chain'
              className=' kekk px-2 text'
            >
              telegram
            </a>
          </li>
          <li className='nav-item'>
            <a
              href='https://github.com/hadzhehsen/elbrus_smart_chain'
              className=' kekk px-2 text'
            >
              github
            </a>
          </li>
          <li className='nav-item'>
            <a
              href='https://vc.ru/finance/294734-gayd-po-nft-tokenam-zachem-nuzhny-gde-kupit-i-kak-oni-rabotayut'
              className=' kekk px-2 text'
            >
              faq
            </a>
          </li>
          <li className='nav-item'>
            <a
              href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'
              className=' kekk px-2 text'
            >
              about
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Footer;
