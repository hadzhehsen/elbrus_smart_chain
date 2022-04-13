import { Button } from "react-bootstrap";

export default function ConnectButton({connect}) {
 return (
   <>
   <h1>Connect your MetaMask wallet</h1>
  <Button onClick={connect} variant='light'>
  Connect
  </Button>
   </>
  )
}
