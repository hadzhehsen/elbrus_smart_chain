import style from './style.module.css'
export default function Loader2() {
  return (
    <>

      <div className={style.spinnerbox}>
        <div className={`${style.blueorbit} ${style.leo}`}>
        </div>

        <div className={`${style.greenorbit} ${style.leo}`}>
        </div>

        <div className={`${style.redorbit} ${style.leo}`}>
        </div>

        <div className={`${style.whiteorbit} ${style.w1} ${style.leo}`}>
        </div><div className={`${style.whiteorbit} ${style.w2} ${style.leo}`}>
        </div><div className={`${style.whiteorbit} ${style.w3} ${style.leo}`}>
        </div>
      </div>
    </>
  )
}
