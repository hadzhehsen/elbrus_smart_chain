import WalletCard from '../Metamask/WalletCard';
import WalletCardEthers from '../Metamask/WalletCardEthers';
import style from './styles.module.css';

export default function Connect() {
  return (
    <>
    <div className={style.div}>
    <WalletCard/>
    {/* <WalletCardEthers/> */}
    </div>
    </>
  );
}
